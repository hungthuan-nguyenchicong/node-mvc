# Cách kết hợp Vite, Express và Pug cho MPA SSR

Có, bạn hoàn toàn có thể kết hợp Vite, Express, và Pug để xây dựng một ứng dụng MPA hỗ trợ SSR. Việc này cho phép bạn tận dụng tốc độ phát triển nhanh của Vite, sự mạnh mẽ của Express trong việc xử lý backend, và cú pháp súc tích, dễ bảo trì của Pug cho các template HTML.

-----

### Cách kết hợp Vite, Express và Pug cho MPA SSR

Quá trình này yêu cầu một plugin Vite để xử lý các file Pug và một server Express để quản lý việc định tuyến và SSR.

#### 1\. Cài đặt các thư viện cần thiết

Đầu tiên, bạn cần cài đặt các gói sau:

```bash
npm install express vite pug vite-plugin-pug --save
```

  - `express`: Server backend.
  - `vite`: Công cụ build frontend.
  - `pug`: Template engine.
  - `vite-plugin-pug`: Plugin cho Vite để xử lý các file Pug.

-----

#### 2\. Cấu trúc dự án và các file Pug

Tạo một cấu trúc dự án đơn giản:

```
/my-pug-mpa-ssr
├── /src
│   ├── /pages
│   │   ├── about.pug
│   │   └── index.pug
│   ├── main.js
├── package.json
├── vite.config.js
└── server.js
```

  - **`src/pages/index.pug`**: Trang chủ
    ```pug
    doctype html
    html(lang="en")
      head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Trang chủ
      body
        h1 Chào mừng đến trang chủ!
        a(href="/about") Đến trang Giới thiệu
        #root
        script(type="module", src="/src/main.js")
    ```
  - **`src/pages/about.pug`**: Trang giới thiệu
    ```pug
    doctype html
    html(lang="en")
      head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Giới thiệu
      body
        h1 Đây là trang Giới thiệu
        a(href="/") Quay lại trang chủ
        #root
        script(type="module", src="/src/main.js")
    ```

-----

#### 3\. Cấu hình Vite

Cấu hình Vite để nhận diện các file Pug là điểm vào của ứng dụng.
`vite.config.js`:

```javascript
import { resolve } from 'path';
import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';

export default defineConfig({
  plugins: [pugPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.pug'),
        about: resolve(__dirname, 'src/pages/about.pug'),
      },
    },
  },
});
```

  - `plugins: [pugPlugin()]`: Kích hoạt plugin Pug để Vite có thể xử lý các file `.pug`.
  - `build.rollupOptions.input`: Định nghĩa các **điểm vào** cho ứng dụng MPA, chỉ rõ Vite sẽ build hai file Pug riêng biệt.

-----

#### 4\. Tạo Express server với SSR

Đây là phần quan trọng nhất để kết hợp ba thành phần. Server Express sẽ dùng logic SSR để xử lý các yêu cầu.

`server.js`:

```javascript
const express = require('express');
const { createServer } = require('vite');
const pug = require('pug');
const path = require('path');
const fs = require('fs');

async function createServerAndRender() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  let vite;
  if (!isProd) {
    // Chế độ phát triển
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    // Chế độ sản xuất
    app.use(express.static('dist'));
  }

  // Logic SSR
  const renderPug = (pagePath, data) => {
    return new Promise((resolve, reject) => {
      try {
        const template = fs.readFileSync(path.resolve(__dirname, 'src', 'pages', pagePath), 'utf-8');
        const renderedHtml = pug.render(template, data);
        resolve(renderedHtml);
      } catch (e) {
        reject(e);
      }
    });
  };

  app.get('/', async (req, res) => {
    const serverData = { message: 'Nội dung từ Server-Side Rendered' };
    const pageHtml = await renderPug('index.pug', serverData);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(pageHtml);
  });

  app.get('/about', async (req, res) => {
    const pageHtml = await renderPug('about.pug');
    res.status(200).set({ 'Content-Type': 'text/html' }).end(pageHtml);
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

createServerAndRender();
```

  - `pug.render()`: Express sử dụng thư viện `pug` để biên dịch file `.pug` thành HTML trên server.
  - `renderPug()`: Một hàm tiện ích để đọc file Pug và render nó. Bạn có thể truyền dữ liệu từ server (`serverData`) vào template Pug, tạo nên một trang HTML đã được render hoàn chỉnh.
  - `if (!isProd)`: Trong môi trường phát triển, Vite middleware sẽ xử lý các yêu cầu, bao gồm cả hot-reload, giúp việc phát triển nhanh hơn.
  - `if (isProd)`: Trong môi trường sản xuất, Express chỉ cần phục vụ các file tĩnh đã được build bởi Vite (`dist/`).

### Chạy ứng dụng

Trong `package.json`, thêm các script sau:

```json
"scripts": {
    "dev": "node server.js",
    "build": "vite build",
    "start": "NODE_ENV=production node server.js"
}
```

  - `npm run dev`: Khởi động server Express trong chế độ phát triển, Vite sẽ xử lý việc hot-reload.
  - `npm run build`: Build các file Pug thành HTML tĩnh cho môi trường sản xuất.
  - `npm run start`: Chạy server Express và phục vụ các file đã được build.

  ## ví dụ

  Ví dụ:

File Pug (index.pug):

Đoạn mã

h1= title
p= message
Code Express:

JavaScript

const serverData = {
  title: 'Trang chủ',
  message: 'Nội dung từ Server-Side Rendered'
};
const pageHtml = pug.render(template, serverData);
HTML output:

HTML

<h1>Trang chủ</h1>
<p>Nội dung từ Server-Side Rendered</p>
Pug sử dụng cú pháp h1= title để biết rằng nó cần chèn giá trị của biến title vào trong thẻ <h1>.

Để chỉ định nơi thêm dữ liệu, bạn chỉ cần sử dụng các cú pháp của Pug:

=: Chèn giá trị biến.

!=: Chèn giá trị biến mà không escape HTML (thường dùng cho dữ liệu HTML thô).

each: Lặp qua một mảng.

if/else: Logic điều kiện.