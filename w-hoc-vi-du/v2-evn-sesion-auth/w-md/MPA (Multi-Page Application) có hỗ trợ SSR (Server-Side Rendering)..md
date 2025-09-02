# MPA (Multi-Page Application) có hỗ trợ SSR (Server-Side Rendering).

Chắc chắn rồi. Bạn có thể kết hợp **Vite** với **Express** để xây dựng ứng dụng **MPA (Multi-Page Application)** có hỗ trợ **SSR (Server-Side Rendering)**.

Vite, với khả năng xử lý **ES modules** và **HMR (Hot Module Replacement)**, có thể đóng vai trò là một máy chủ phát triển (dev server) hiệu quả, trong khi Express sẽ đóng vai trò là backend để xử lý các route và trả về HTML đã được render từ server.

Dưới đây là một ví dụ cơ bản về cách kết hợp ba thành phần này.

-----

### 1\. Cấu hình dự án

Tạo một cấu trúc thư mục như sau:

```
/my-mpa-project
├── /src
│   ├── /pages
│   │   ├── about.html
│   │   └── index.html
│   ├── main.js
├── package.json
├── vite.config.js
└── server.js
```

### 2\. Cài đặt các thư viện cần thiết

```bash
npm install express vite --save
```

### 3\. Cấu hình Vite cho MPA

Vì bạn đang xây dựng một ứng dụng đa trang, bạn cần cấu hình Vite để xử lý nhiều điểm vào (`entry points`).

`vite.config.js`:

```javascript
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
      },
    },
  },
});
```

### 4\. Tạo các trang HTML

Tạo hai file HTML cơ bản.

`src/pages/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trang chủ</title>
</head>
<body>
    <h1>Chào mừng đến với trang chủ!</h1>
    <a href="/about">Đến trang Giới thiệu</a>
    <div id="root"></div>
    <script type="module" src="/src/main.js"></script>
</body>
</html>
```

`src/pages/about.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giới thiệu</title>
</head>
<body>
    <h1>Đây là trang Giới thiệu</h1>
    <a href="/">Quay lại trang chủ</a>
    <script type="module" src="/src/main.js"></script>
</body>
</html>
```

### 5\. Xử lý logic phía client

Bạn có thể thêm logic JavaScript vào `src/main.js`. Đoạn code này sẽ chạy trên cả hai trang.

`src/main.js`:

```javascript
document.querySelector('#root').innerHTML = `
    <p>Nội dung được render từ client.</p>
`;

console.log('Client-side script is running!');
```

### 6\. Tạo Express server với SSR

Đây là phần cốt lõi. Chúng ta sẽ sử dụng Express để serve các trang HTML và xử lý SSR.

`server.js`:

```javascript
const express = require('express');
const { createServer } = require('vite');

async function createServerAndRender() {
    const app = express();
    const isProd = process.env.NODE_ENV === 'production';

    let vite;
    if (!isProd) {
        // Chế độ phát triển (Development)
        vite = await createServer({
            server: {
                middlewareMode: true
            },
            appType: 'custom'
        });
        // Sử dụng Vite middleware để xử lý các yêu cầu
        app.use(vite.middlewares);
    } else {
        // Chế độ sản xuất (Production)
        // Serve các file tĩnh đã được build bởi Vite
        app.use(express.static('dist'));
    }

    // SSR Logic: Xử lý các route
    app.get('/', async (req, res) => {
        try {
            // Đọc nội dung file HTML
            const template = isProd ?
                require('fs').readFileSync('./dist/index.html', 'utf-8') :
                await vite.transformIndexHtml(req.url, require('fs').readFileSync('./src/pages/index.html', 'utf-8'));

            // Ở đây bạn có thể thêm logic SSR của mình.
            // Ví dụ, truyền dữ liệu từ server vào template.
            const serverData = 'Dữ liệu từ Server-Side Rendered';
            const htmlWithData = template.replace('<body>', `<body><p>${serverData}</p>`);

            res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlWithData);
        } catch (e) {
            !isProd && vite.ssrFixStacktrace(e);
            console.error(e.stack);
            res.status(500).end(e.stack);
        }
    });

    app.get('/about', async (req, res) => {
        try {
            const template = isProd ?
                require('fs').readFileSync('./dist/about.html', 'utf-8') :
                await vite.transformIndexHtml(req.url, require('fs').readFileSync('./src/pages/about.html', 'utf-8'));

            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
            !isProd && vite.ssrFixStacktrace(e);
            console.error(e.stack);
            res.status(500).end(e.stack);
        }
    });

    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

createServerAndRender();
```

### 7\. Chạy ứng dụng

Trong `package.json`, thêm các script sau:

```json
"scripts": {
    "dev": "node server.js",
    "build": "vite build",
    "start": "NODE_ENV=production node server.js"
}
```

  * **`npm run dev`**: Chạy ứng dụng ở chế độ phát triển. Vite sẽ xử lý việc hot-reload và Express sẽ phục vụ các trang.
  * **`npm run build`**: Biên dịch các file frontend để sẵn sàng cho môi trường sản xuất.
  * **`npm run start`**: Chạy ứng dụng ở chế độ sản xuất, phục vụ các file tĩnh đã được build.

### Tổng kết

Cách tiếp cận này cho phép bạn tận dụng tốc độ của Vite trong quá trình phát triển, đồng thời sử dụng Express để kiểm soát việc định tuyến và thực hiện SSR. Điều này giúp tối ưu hóa hiệu suất ứng dụng, đặc biệt với SEO và tốc độ tải trang ban đầu.