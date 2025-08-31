# Express backend với Vite frontend sử dụng Pug và Vite's middleware.

Có, bạn hiểu đúng rồi. Về cơ bản, Vite không bắt buộc phải có một file HTML làm điểm vào chính (`index.html`). Nó có thể sử dụng một file Pug làm điểm vào, và Vite sẽ xử lý nó.

Tuy nhiên, có một chút khác biệt nhỏ khi sử dụng Pug so với HTML thông thường. Vite không tự động biết cách xử lý file `.pug` ngay lập tức. Bạn cần phải cài đặt và cấu hình một **plugin Vite** để nó có thể biên dịch file Pug thành HTML. Khi đã cấu hình xong, bạn có thể chỉ định file Pug làm điểm vào (entry point) cho dự án của mình.

Dưới đây là một ví dụ đơn giản về việc kết hợp **Express backend** với **Vite frontend** sử dụng **Pug** và **Vite's middleware**.

-----

### Cài đặt

1.  **Frontend (Vite + Pug):**

    ```bash
    npm install vite vite-plugin-pug -D
    ```

2.  **Backend (Express):**

    ```bash
    npm install express
    ```

### Cấu hình dự án

1.  **Cấu trúc thư mục:**

    ```
    /my-project
    ├── /public
    ├── /src
    │   └── main.js
    │   └── index.pug
    ├── package.json
    ├── vite.config.js
    └── server.js
    ```

2.  **`src/index.pug`:**

    ```pug
    doctype html
    html(lang="en")
      head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Pug & Vite Example
      body
        h1 Chào mừng đến với Vite & Pug!
        p Đây là một ví dụ đơn giản.
        #app
        script(type="module", src="/src/main.js")
    ```

3.  **`src/main.js`:**

    ```javascript
    import './style.css'; // Ví dụ, bạn có thể import CSS vào đây

    document.querySelector('#app').innerHTML = `
      <button>Click me</button>
    `;
    ```

4.  **`vite.config.js`:** Cấu hình Vite để sử dụng plugin Pug.

    ```javascript
    import { defineConfig } from 'importer/vite';
    import pugPlugin from 'vite-plugin-pug-static'; // Sử dụng plugin này thay vì pug.

    export default defineConfig({
      plugins: [pugPlugin()],
      // Tùy chọn: Thay đổi điểm vào nếu cần
      build: {
        rollupOptions: {
          input: 'src/index.pug',
        },
      },
    });
    ```

5.  **`server.js` (Express backend):**
    Chúng ta sẽ sử dụng Express để phục vụ ứng dụng Vite. Trong quá trình phát triển, chúng ta dùng **`vite.devMiddleware()`**. Khi sản xuất, chúng ta sẽ phục vụ các tệp đã được build.

    ```javascript
    const express = require('express');
    const path = require('path');
    const { createServer } = require('vite');

    async function createViteExpressApp() {
      const app = express();

      // Sử dụng Vite middleware chỉ trong môi trường phát triển
      if (process.env.NODE_ENV === 'development') {
        const vite = await createServer({
          server: {
            middlewareMode: true
          }
        });
        app.use(vite.middlewares);
      } else {
        // Trong môi trường production, phục vụ các file tĩnh đã được build
        app.use(express.static(path.resolve(__dirname, 'dist')));
      }

      // Route chính để phục vụ trang của bạn
      app.get('*', (req, res) => {
        // Trong môi trường dev, Vite đã xử lý file Pug.
        // Trong môi trường prod, Vite đã build file HTML.
        // Cả hai trường hợp đều trả về HTML đã được biên dịch.
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });

      return app;
    }

    createViteExpressApp().then(app => {
      const port = 3000;
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });
    });
    ```

    **Lưu ý:**

      * Bạn cần cài đặt `vite-plugin-pug-static` vì nó xử lý Pug tốt hơn cho mục đích này.
      * Trong `server.js`, chúng ta kiểm tra `process.env.NODE_ENV` để biết môi trường. Trong dev, Vite sẽ xử lý và biên dịch file Pug ngay lập tức. Trong production, bạn cần chạy `npm run build` trước để Vite biên dịch file Pug thành HTML và đặt trong thư mục `dist`.

Như vậy, bạn có thể hoàn toàn dùng Pug làm điểm vào, miễn là có plugin để Vite có thể xử lý nó.