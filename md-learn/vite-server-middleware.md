## vite-server-middleware

Tóm tắt yêu cầu của bạn, bạn muốn:

1.  **Tất cả các đường dẫn không khớp đều trả về `index.html` (hay còn gọi là fallback).**
2.  **Tất cả các đường dẫn trong `/admin/` cũng sẽ được xử lý và trả về `/admin/index.html`.**

Bạn có thể cấu hình điều này trong file `vite.config.js` bằng cách sử dụng một plugin Vite hoặc điều chỉnh cấu hình server. Dưới đây là cách bạn có thể thực hiện:

### Cấu hình `vite.config.js`

Bạn có thể sử dụng thuộc tính `server.historyApiFallback` hoặc viết một plugin đơn giản. Cách đơn giản nhất là sử dụng middleware của Vite.

-----

### Cách 1: Sử dụng Middleware Vite

Bạn có thể thêm middleware tùy chỉnh vào server phát triển của Vite để xử lý các yêu cầu này.

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Cấu hình chung cho server
    middleware: (app) => {
      // Middleware cho fallback /admin/
      app.use('/admin', (req, res, next) => {
        // Kiểm tra xem yêu cầu có phải là file tĩnh hay không
        // Nếu không, chuyển hướng về /admin/index.html
        if (!req.url.includes('.')) {
          req.url = '/admin/index.html';
        }
        next();
      });

      // Middleware cho fallback chung
      app.use((req, res, next) => {
        // Tương tự, nếu không phải file tĩnh, chuyển hướng về /index.html
        if (!req.url.includes('.')) {
          req.url = '/index.html';
        }
        next();
      });
    },
  },
});
```

**Ưu điểm:**

  * **Linh hoạt:** Cho phép bạn kiểm soát logic fallback một cách chi tiết.
  * **Đa năng:** Có thể áp dụng cho nhiều trường hợp khác nhau.

**Nhược điểm:**

  * Cần hiểu biết về Express.js (middleware của Vite dựa trên Express).

-----

### Cách 2: Sử dụng `rewrite` trong `vite-plugin-rewrite-all`

Nếu bạn muốn một giải pháp đơn giản hơn, bạn có thể sử dụng một plugin bên ngoài như `vite-plugin-rewrite-all`.

1.  **Cài đặt plugin:**

    ```bash
    npm install vite-plugin-rewrite-all --save-dev
    ```

2.  **Cấu hình trong `vite.config.js`:**

    ```javascript
    // vite.config.js
    import { defineConfig } from 'vite';
    import rewriteAll from 'vite-plugin-rewrite-all';

    export default defineConfig({
      plugins: [
        rewriteAll([
          // Rewrite các đường dẫn trong /admin/ về /admin/index.html
          { from: '^/admin/(.*)', to: '/admin/index.html' },

          // Rewrite tất cả các đường dẫn còn lại về /index.html
          { from: '^(.*)', to: '/index.html' },
        ]),
      ],
    });
    ```

**Ưu điểm:**

  * **Cú pháp đơn giản:** Dễ hiểu và cấu hình bằng Regex.
  * **Dễ dàng bảo trì:** Các quy tắc rewrite được tổ chức rõ ràng.

**Nhược điểm:**

  * Phụ thuộc vào một plugin bên ngoài.

-----

### Cân nhắc khi lựa chọn

  * Nếu bạn chỉ cần một giải pháp nhanh chóng và không muốn viết code phức tạp, hãy sử dụng **Cách 2** với plugin `vite-plugin-rewrite-all`.
  * Nếu bạn muốn kiểm soát chi tiết hơn và không ngại viết code, **Cách 1** (sử dụng middleware) là một lựa chọn tốt.
  * Lưu ý, các cách trên chỉ áp dụng cho **server dev của Vite**. Khi deploy lên môi trường production, bạn cần cấu hình web server (như Nginx, Apache) hoặc hosting (Vercel, Netlify,...) để thực hiện các quy tắc fallback tương tự.