## // Middleware kiểm tra và bảo vệ tệp tĩnh

Có, bạn có thể tạo một middleware trên Express để xử lý việc xác thực cho các tệp tĩnh cụ thể. Đây là cách làm để chặn truy cập trực tiếp vào các tệp `.js` và `.css` trong thư mục `/admin/` nếu người dùng chưa được xác thực.

-----

### Cách làm

Bạn cần định nghĩa một middleware kiểm tra xác thực và đặt nó **trước** middleware phục vụ tệp tĩnh của Express (`express.static`). Middleware này sẽ kiểm tra URL của yêu cầu.

```javascript
// server.js (Express Backend)

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({
    secret: 'my-super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

// Middleware xác thực
const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Middleware kiểm tra và bảo vệ tệp tĩnh
const protectAdminFiles = (req, res, next) => {
    // Lấy đường dẫn yêu cầu
    const requestPath = req.path;
    
    // Kiểm tra xem URL có phải là /admin/ và kết thúc bằng .js hoặc .css không
    const isProtectedFile = requestPath.startsWith('/admin/') && 
                            (requestPath.endsWith('.js') || requestPath.endsWith('.css'));

    if (isProtectedFile) {
        // Nếu là tệp cần bảo vệ, gọi middleware xác thực
        isAuthenticated(req, res, next);
    } else {
        // Nếu không, cho phép yêu cầu đi tiếp
        next();
    }
};

// Đặt middleware bảo vệ trước khi phục vụ tệp tĩnh
app.use(protectAdminFiles);

// Phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Các route API của bạn
app.post('/api/login', (req, res) => {
    // ... logic đăng nhập
});

// ... các route API khác

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

### Cách thức hoạt động

1.  Khi một yêu cầu đến server (ví dụ: `/admin/admin.js`), middleware `protectAdminFiles` sẽ được gọi đầu tiên.
2.  Nó kiểm tra URL và thấy rằng nó khớp với điều kiện (`/admin/` và kết thúc bằng `.js`).
3.  Khi đó, nó sẽ gọi middleware `isAuthenticated`.
4.  Middleware `isAuthenticated` kiểm tra session.
      * Nếu session hợp lệ, nó gọi `next()`. Yêu cầu sẽ đi tiếp đến `app.use(express.static(...))` và tệp tĩnh sẽ được phục vụ.
      * Nếu session không hợp lệ, nó trả về `401 Unauthorized` và quá trình xử lý yêu cầu dừng lại.

**Lưu ý:** Mặc dù cách này hoạt động, nhưng nó thường không được coi là **cách tốt nhất** trong môi trường sản phẩm. Cách tiếp cận phổ biến và mạnh mẽ hơn vẫn là sử dụng Nginx hoặc một proxy tương tự để xử lý việc phục vụ tệp tĩnh, và chỉ sử dụng Express để quản lý các API được bảo vệ.