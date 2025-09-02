# Express để render template Pug trực tiếp trên server.

Bạn nói đúng. Nếu bạn chỉ phục vụ các file HTML tĩnh đã được Vite build, Express sẽ không thể chèn nội dung động từ database vào. Điều này là do quá trình biên dịch Vite chỉ diễn ra một lần khi bạn chạy lệnh `npm run build`, tạo ra các file HTML cố định.

Để có thể chèn dữ liệu động từ database vào ứng dụng của bạn trong môi trường production, bạn không thể chỉ phục vụ file HTML tĩnh. Bạn cần sử dụng **Express để render template Pug trực tiếp trên server**.

-----

### **Cách Express xử lý SSR trong môi trường sản xuất**

Thay vì phụ thuộc vào việc Vite build ra file HTML tĩnh, Express sẽ đảm nhận toàn bộ quá trình render Pug, cả trong môi trường phát triển lẫn sản xuất.

1.  **Chuyển đổi chiến lược:** Bạn sẽ không dùng `vite build` để tạo ra HTML. Thay vào đó, bạn chỉ dùng Vite để build các file JavaScript và CSS.
2.  **Express làm nhiệm vụ render:** Trong file `server.js`, bạn sẽ sử dụng thư viện `pug` để đọc các file `.pug` và render chúng khi có request đến.

-----

### **Ví dụ cập nhật**

Dưới đây là cách bạn cần thay đổi logic trong `server.js` và `vite.config.js`.

#### **1. Cập nhật `vite.config.js`**

Bạn cần loại bỏ các file Pug khỏi quy trình build của Vite. Vite chỉ nên build các file JavaScript và CSS của bạn.

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Chỉ định các file JavaScript là điểm vào
        main: 'src/main.js',
        // Bỏ qua các file Pug ở đây
      },
    },
  },
});
```

Bạn cũng có thể giữ lại plugin Pug nếu bạn muốn tận dụng cú pháp Pug để viết các template JavaScript, nhưng không sử dụng nó để build ra HTML.

#### **2. Cập nhật `server.js`**

Đây là phần quan trọng nhất. Bạn sẽ bỏ qua việc phục vụ HTML tĩnh và thay vào đó, Express sẽ đọc và render template Pug mỗi khi có yêu cầu.

```javascript
const express = require('express');
const { createServer } = require('vite');
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const connectDB = require('./database'); // Đảm bảo bạn có file này
const Product = require('./models/product'); // Đảm bảo bạn có file này

async function createServerAndRender() {
    const app = express();
    const isProd = process.env.NODE_ENV === 'production';

    // Kết nối database
    await connectDB();

    let vite;
    if (!isProd) {
        // Chế độ phát triển
        vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });
        app.use(vite.middlewares);
    } else {
        // Chế độ sản xuất: Phục vụ các file tĩnh (CSS/JS) đã được build
        app.use(express.static('dist'));
    }

    // Thiết lập Pug là template engine
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'src', 'pages'));

    // Route để hiển thị danh sách sản phẩm
    app.get('/', async (req, res) => {
        try {
            // Truy vấn dữ liệu từ database
            const products = await Product.find({});

            // Render template Pug với dữ liệu
            res.render('index', { // Tên file .pug (không có đuôi)
                title: 'Danh sách sản phẩm',
                products: products
            });
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

### **Giải thích sự thay đổi**

1.  **`app.set('view engine', 'pug');` và `app.set('views', ...);`**: Đây là cách Express thiết lập một template engine. Khi bạn đã cài đặt Pug, Express sẽ tự động biết cách sử dụng nó.
2.  **`res.render('index', { ... });`**: Đây là phương thức chuẩn của Express để render một template. Express sẽ tìm file `index.pug` trong thư mục `views` (`src/pages`) và truyền đối tượng dữ liệu `{ ... }` vào đó. Express sẽ thực hiện toàn bộ quá trình biên dịch và trả về HTML đã được render hoàn chỉnh.
3.  **Môi trường `production`**: Khi bạn chạy `npm run build` và sau đó `npm run start`, Vite sẽ build các file CSS và JS vào thư mục `dist`. Lệnh `app.use(express.static('dist'))` sẽ phục vụ các file tĩnh này, nhưng Express vẫn sẽ đảm nhiệm việc render các trang Pug.

### **Kết luận**

Để chèn dữ liệu động vào, bạn **phải** để Express đảm nhận việc render template trong cả môi trường phát triển và sản xuất. Quá trình biên dịch của Vite không thể thực hiện việc này vì nó không có quyền truy cập vào database của bạn khi build. Chiến lược là sử dụng **Express làm bộ não SSR**, và **Vite để xử lý các tài nguyên front-end tĩnh** (như JS/CSS) và cung cấp một môi trường phát triển nhanh chóng.