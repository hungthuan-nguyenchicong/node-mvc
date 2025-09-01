# /api/check-auth
/api/check-auth
# Có, bạn hoàn toàn có thể cấu hình Express chỉ để xử lý logic API và xác thực

Có, bạn hoàn toàn có thể cấu hình Express chỉ để xử lý logic API và xác thực, trong khi Nginx hoặc Vite đảm nhận việc phục vụ các tệp tĩnh. Đây là mô hình triển khai ứng dụng web hiện đại và hiệu quả nhất.

-----

### Mô hình hoạt động

1.  **Server Express**: Đóng vai trò là backend, chỉ xử lý các yêu cầu API. Nó không phục vụ bất kỳ tệp tĩnh nào. Middleware `express-session` sẽ hoạt động ở đây để quản lý session.
2.  **Nginx/Vite**: Đóng vai trò là frontend, chịu trách nhiệm phục vụ tất cả các tệp tĩnh (HTML, CSS, JS, hình ảnh).

### Cấu hình trong Express

Bạn sẽ loại bỏ dòng `app.use(express.static(...))` và chỉ giữ lại các route API. Express sẽ chỉ lắng nghe các yêu cầu đến các endpoint như `/api/login` hoặc `/api/admin-data`.

```javascript
// server.js (Express Backend)

const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({
    secret: 'my-super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

app.post('/api/login', (req, res) => {
    // ... logic đăng nhập
    if (req.body.username === 'admin' && req.body.password === 'admin123') {
        req.session.isAuthenticated = true;
        req.session.user = { username: 'admin' };
        return res.status(200).send('Login successful');
    }
    res.status(401).send('Invalid credentials');
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.send('Logged out'));
});

app.get('/api/admin-data', isAuthenticated, (req, res) => {
    res.json({ message: `Welcome, ${req.session.user.username}!` });
});

app.listen(PORT, () => {
    console.log(`Express API server running on http://localhost:${PORT}`);
});
```

-----

### Cấu hình trong Nginx hoặc Vite

#### 1\. Sử dụng Nginx (Môi trường sản phẩm)

Nginx sẽ phục vụ các tệp tĩnh và proxy các yêu cầu API đến Express.

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;

    # Phục vụ tất cả các tệp tĩnh từ thư mục build của bạn (ví dụ: dist)
    root /path/to/your/frontend/dist;
    index index.html;

    # Logic để xử lý URL
    location / {
        # Nếu tệp tĩnh tồn tại, Nginx sẽ phục vụ nó.
        # Nếu không, nó sẽ trả về index.html cho các route của SPA.
        try_files $uri $uri/ /index.html;
    }

    # Proxy các yêu cầu API đến server Express
    location /api/ {
        proxy_pass http://localhost:3000;
        # ... các cài đặt proxy khác
    }
}
```

#### 2\. Sử dụng Vite (Môi trường phát triển)

Vite cung cấp một proxy tích hợp sẵn trong `vite.config.js`.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Hoặc plugin tương ứng

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Proxy các yêu cầu bắt đầu bằng '/api' đến server Express
            '/api': 'http://localhost:3000'
        }
    }
});
```

### Cách thức hoạt động

Với cấu hình này, khi bạn truy cập `http://your-domain.com/admin`:

1.  Nginx sẽ nhận yêu cầu và, theo cấu hình `try_files`, sẽ phục vụ tệp `/admin/index.html` (hoặc tệp tĩnh tương ứng).
2.  Trang `index.html` sẽ tải JavaScript. Đoạn mã JavaScript này sẽ tự động gửi yêu cầu đến `/api/login` (hoặc `/api/admin-data`).
3.  Khi trình duyệt gửi yêu cầu đến `/api/...`, Nginx/Vite sẽ chặn yêu cầu này và chuyển hướng (proxy) nó đến server Express đang chạy trên cổng 3000.
4.  Server Express nhận yêu cầu, xử lý session và trả về dữ liệu. Nginx/Vite sẽ chuyển tiếp phản hồi này trở lại trình duyệt.
5.  Trình duyệt xử lý phản hồi và, tùy thuộc vào kết quả, sẽ hiển thị trang admin hoặc chuyển hướng người dùng về trang đăng nhập nếu session không hợp lệ.

Bằng cách này, bạn đạt được sự phân tách rõ ràng giữa frontend (do Nginx/Vite xử lý) và backend (do Express xử lý).