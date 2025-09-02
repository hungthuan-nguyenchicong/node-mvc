## nhẹ cho các tác vụ đơn giản
cookie-session

## tốn ram cho trang quản trị 
express-session

## tài liệu tham khảo

Đầu tiên, cài đặt các thư viện cần thiết: `express`, `express-session`, và `express-handlebars` (ví dụ cho template engine).

```bash
npm install express express-session express-handlebars
```

### 1\. Thiết lập cơ bản

Tạo một file `server.js` và cấu hình `express-session` ở mức cơ bản. Middleware này sẽ quản lý session và lưu dữ liệu người dùng trên máy chủ.

```javascript
// server.js
import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Cấu hình Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình session
app.use(session({
    secret: 'my-super-secret-key', // Khóa bí mật để ký session ID
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: true, // Lưu session mới chưa được khởi tạo
    cookie: { 
        secure: false, // Đặt là true nếu dùng HTTPS
        httpOnly: true, // Ngăn JS client truy cập cookie
        maxAge: 1000 * 60 * 60 * 24 // Thời gian sống của session (24h)
    }
}));
```

-----

### 2\. Middleware xác thực

Tạo một middleware để kiểm tra xem người dùng đã đăng nhập hay chưa. Nếu chưa, chuyển hướng họ về trang đăng nhập.

```javascript
// Middleware kiểm tra trạng thái đăng nhập
const isAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next(); // Đã đăng nhập, cho phép tiếp tục
    } else {
        res.redirect('/login'); // Chưa đăng nhập, chuyển hướng
    }
};
```

-----

### 3\. Xử lý các route

Viết các route cho trang đăng nhập, đăng xuất và trang quản trị.

```javascript
// Route hiển thị trang login
app.get('/login', (req, res) => {
    res.render('login');
});

// Route xử lý logic đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Giả lập kiểm tra người dùng
    if (username === 'admin' && password === 'admin123') {
        req.session.isLoggedIn = true; // Lưu trạng thái đăng nhập vào session
        req.session.user = { username: 'admin' }; // Lưu thông tin người dùng
        res.redirect('/admin/dashboard');
    } else {
        // Có thể hiển thị thông báo lỗi
        res.redirect('/login');
    }
});

// Route trang dashboard quản trị (bảo vệ bằng middleware)
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.session.user });
});

// Route xử lý đăng xuất
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/login');
    });
});
```

### 4\. Tạo các file view (HTML/Handlebars)

Tạo thư mục `views` và các file `login.handlebars` và `dashboard.handlebars`.

**views/login.handlebars**

```html
<form action="/login" method="POST">
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Đăng nhập</button>
</form>
```

**views/dashboard.handlebars**

```html
<h1>Chào mừng, {{user.username}}!</h1>
<p>Bạn đã đăng nhập thành công vào trang quản trị.</p>
<form action="/logout" method="POST">
    <button type="submit">Đăng xuất</button>
</form>
```

### 5\. Khởi chạy server

Thêm `app.listen()` vào cuối file `server.js` để khởi chạy ứng dụng.

```javascript
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
```

Bây giờ, bạn có một hệ thống đăng nhập/đăng xuất cơ bản bằng `express-session`. Khi người dùng đăng nhập, thông tin được lưu trong session trên máy chủ, và cookie chỉ chứa một ID để liên kết trình duyệt với session đó.