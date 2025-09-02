## Server-Side Rendering với dữ liệu động

Để truyền dữ liệu động từ database vào template Pug trong ứng dụng SSR với Express và Vite, bạn cần thực hiện các bước sau:

1.  **Thiết lập kết nối với database:** Sử dụng một thư viện kết nối database (ví dụ: `mysql`, `pg`, `mongoose` cho MongoDB) trong Express server của bạn.
2.  **Truy vấn dữ liệu:** Viết logic để lấy dữ liệu cần thiết từ database.
3.  **Truyền dữ liệu vào template Pug:** Khi nhận được kết quả từ database, bạn truyền dữ liệu đó vào hàm render của Pug.

Dưới đây là một ví dụ cơ bản sử dụng `express` và `mongoose` (cho MongoDB), bạn có thể thay thế bằng bất kỳ thư viện database nào khác.

-----

### 1\. Cài đặt các gói cần thiết

Ngoài các gói đã có (`express`, `vite`, `pug`), bạn cần cài đặt thư viện để kết nối với database. Ví dụ, với MongoDB:

```bash
npm install mongoose
```

-----

### 2\. Cấu hình kết nối Database

Tạo một file riêng để quản lý kết nối database, ví dụ `database.js`.

**`database.js`**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/my_app_db');
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

-----

### 3\. Định nghĩa Model và truy vấn dữ liệu

Tạo một schema và model cho dữ liệu của bạn. Ví dụ, một model cho "sản phẩm".

**`models/product.js`**

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
```

-----

### 4\. Cập nhật Express Server để lấy dữ liệu động

Bây giờ, bạn sẽ sửa đổi `server.js` để kết nối database, lấy dữ liệu và truyền nó vào template.

**`server.js`**

```javascript
const express = require('express');
const { createServer } = require('vite');
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const connectDB = require('./database'); // Import kết nối database
const Product = require('./models/product'); // Import Product Model

async function createServerAndRender() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  // Kết nối database
  await connectDB();

  let vite;
  if (!isProd) {
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  // Hàm tiện ích để render Pug
  const renderPug = (pagePath, data) => {
    try {
      const templatePath = path.resolve(__dirname, 'src', 'pages', pagePath);
      const template = fs.readFileSync(templatePath, 'utf-8');
      return pug.render(template, data);
    } catch (e) {
      console.error('Lỗi khi render Pug:', e);
      throw e;
    }
  };

  // Route để hiển thị danh sách sản phẩm
  app.get('/', async (req, res) => {
    try {
      // 🚀 Truy vấn dữ liệu từ database
      const products = await Product.find({});
      
      const serverData = {
        title: 'Danh sách sản phẩm',
        products: products, // Truyền dữ liệu động vào đây
      };

      const pageHtml = renderPug('index.pug', serverData);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(pageHtml);
    } catch (e) {
      console.error('Lỗi khi truy vấn database:', e);
      res.status(500).send('Lỗi máy chủ nội bộ');
    }
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

createServerAndRender();
```

  - `await connectDB()`: Đảm bảo server kết nối database trước khi lắng nghe các request.
  - `const products = await Product.find({})`: Đây là nơi bạn truy vấn dữ liệu từ MongoDB.
  - `products: products`: Dữ liệu này được truyền vào đối tượng `serverData` và sẽ có sẵn trong template Pug.

-----

### 5\. Cập nhật file Pug để hiển thị dữ liệu

Sửa đổi `src/pages/index.pug` để lặp qua danh sách sản phẩm và hiển thị chúng.

**`src/pages/index.pug`**

```pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title= title
  body
    h1= title
    if products && products.length > 0
      ul
        each product in products
          li
            h2= product.name
            p Giá: #{product.price}
            p= product.description
    else
      p Không có sản phẩm nào được tìm thấy.
    
    script(type="module", src="/src/main.js")
```

  - `title= title`: Hiển thị tiêu đề được truyền từ server.
  - `if products && products.length > 0`: Kiểm tra xem có dữ liệu sản phẩm hay không.
  - `each product in products`: Lặp qua mảng `products` được truyền vào từ server.
  - `p Giá: #{product.price}`: Sử dụng cú pháp nội suy `#{}` để chèn giá trị của biến vào chuỗi.

Với cách tiếp cận này, mỗi khi một request tới route `/`, Express sẽ truy vấn database, lấy danh sách sản phẩm, và truyền nó vào template Pug để render một trang HTML hoàn chỉnh trước khi gửi về client. Đây chính là cách hoạt động cơ bản của **Server-Side Rendering với dữ liệu động**.