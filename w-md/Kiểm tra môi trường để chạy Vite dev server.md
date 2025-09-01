# Kiểm tra môi trường để chạy Vite dev server

Không, `process.env.NODE_ENV === 'development'` **không bị xóa** khi bạn built server.js bằng Vite. Vite chỉ xử lý các file frontend và các biểu thức như `import.meta.env.DEV` hoặc `import.meta.hot`. Do đó, code server-side của bạn sẽ giữ nguyên.

-----

### Lý do

  * **Vite và Node.js là hai môi trường khác nhau**: Vite là một build tool và dev server chủ yếu dành cho frontend, nó xử lý các module ES trong trình duyệt. Node.js là môi trường runtime cho backend. Khi bạn chạy server.js bằng Node.js, nó không trải qua quá trình tối ưu hóa của Vite.
  * **`process.env` là biến môi trường Node.js**: Biến này được định nghĩa và quản lý bởi chính môi trường Node.js, không phải bởi Vite. Khi bạn chạy lệnh `cross-env NODE_ENV=production node server.js`, Node.js sẽ tự động thiết lập biến `NODE_ENV` cho tiến trình.
  * **Vite chỉ xử lý `import.meta.env`**: Các biểu thức như `import.meta.env.DEV` hoặc `import.meta.env.PROD` được Vite tự động thay thế bằng giá trị `true` hoặc `false` trong quá trình built. Đây là cơ chế của Vite để tối ưu hóa code frontend.

-----

### Giải pháp

Để code của bạn hoạt động đúng cách và chỉ chạy Vite dev server trong môi trường phát triển, bạn nên sử dụng `process.env.NODE_ENV` để kiểm tra môi trường. Cách này đảm bảo server của bạn sẽ có logic riêng cho cả development và production, độc lập với Vite.

**Ví dụ:**

```javascript
// server.js
// Các biến môi trường được load từ .env
import 'dotenv/config';

// Kiểm tra môi trường để chạy Vite dev server
if (process.env.NODE_ENV === 'development') {
    const { createServer } = await import('vite');
    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });
    app.use(vite.middlewares);
} else {
    // Phục vụ file tĩnh khi built
    app.use(express.static('dist'));
}
```

Với cách tiếp cận này, khi bạn chạy `npm run dev` (sử dụng `cross-env NODE_ENV=development`), `if` sẽ là `true` và Vite middleware sẽ được kích hoạt. Khi bạn built và chạy server production, `if` sẽ là `false` và server sẽ phục vụ các file tĩnh từ thư mục `dist`.

## v2
