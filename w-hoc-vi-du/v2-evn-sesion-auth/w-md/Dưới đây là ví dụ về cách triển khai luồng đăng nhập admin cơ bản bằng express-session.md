# Dưới đây là ví dụ về cách triển khai luồng đăng nhập admin cơ bản bằng express-session

Dưới đây là ví dụ về cách triển khai luồng đăng nhập admin cơ bản bằng **`express-session`**. Phương pháp này sử dụng session trên server thay vì JWT ở client.

-----

## 1\. Cài đặt và cấu hình

Trước hết, bạn cần cài đặt các thư viện cần thiết:

```bash
npm install express express-session
```

Bạn cũng sẽ cần một bộ nhớ session (session store) để lưu trữ session, nhưng với ví dụ đơn giản này, chúng ta sẽ sử dụng bộ nhớ mặc định.

## 2\. Server Backend (`server.js`)

Sử dụng `express-session` để tạo và quản lý phiên làm việc của người dùng.

```javascript
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Cấu hình Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my-super-secret-key', // Khóa bí mật để ký session ID cookie
    resave: false, // Ngăn lưu lại session nếu không có thay đổi
    saveUninitialized: false, // Ngăn tạo session cho các yêu cầu chưa được khởi tạo
    cookie: { maxAge: 60 * 60 * 1000 } // Thời gian hết hạn của cookie (1 giờ)
}));

// Middleware để xác thực người dùng
const isAuthenticated = (req, res, next) => {
    // Kiểm tra xem session đã được xác thực chưa
    if (req.session.isAuthenticated) {
        next(); // Đã xác thực, tiếp tục
    } else {
        // Chưa xác thực, trả về 401 Unauthorized
        res.status(401).send('Bạn cần phải đăng nhập để truy cập trang này.');
    }
};

// --- API ---

// Route để xử lý đăng nhập
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Logic xác thực đơn giản
    if (username === 'admin' && password === 'admin123') {
        // Đăng nhập thành công, lưu trạng thái vào session
        req.session.isAuthenticated = true;
        req.session.user = { username: 'admin' };
        return res.status(200).send('Đăng nhập thành công!');
    }
    
    res.status(401).send('Sai tên đăng nhập hoặc mật khẩu!');
});

// Route để lấy dữ liệu admin (được bảo vệ)
app.get('/api/admin-data', isAuthenticated, (req, res) => {
    // Chỉ những người dùng đã xác thực mới truy cập được
    res.json({ message: `Chào mừng ${req.session.user.username} đến trang admin!` });
});

// Route để xử lý đăng xuất
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Lỗi khi đăng xuất.');
        }
        res.status(200).send('Đăng xuất thành công!');
    });
});

// --- Phục vụ file tĩnh ---
// Sử dụng router để điều hướng đến trang admin
app.get('/admin', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Phục vụ trang đăng nhập
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

-----

## 3\. Frontend

### Trang Đăng nhập (`public/login.html`)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h1>Đăng nhập Admin</h1>
    <form id="loginForm">
        <input type="text" id="username" placeholder="Tên đăng nhập" required><br><br>
        <input type="password" id="password" placeholder="Mật khẩu" required><br><br>
        <button type="submit">Đăng nhập</button>
    </form>
    <div id="message"></div>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                // Đăng nhập thành công, chuyển hướng người dùng
                window.location.href = '/admin';
            } else {
                const message = await res.text();
                document.getElementById('message').innerText = message;
            }
        });
    </script>
</body>
</html>
```

-----

### Trang Admin (`public/admin.html`)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
</head>
<body>
    <h1>Admin Dashboard</h1>
    <p id="welcomeMessage"></p>
    <button onclick="logout()">Đăng xuất</button>
    <script>
        // Khi trang được tải, lấy dữ liệu admin
        document.addEventListener('DOMContentLoaded', async () => {
            const res = await fetch('/api/admin-data');
            const data = await res.json();
            if (res.ok) {
                document.getElementById('welcomeMessage').innerText = data.message;
            } else {
                // Nếu không xác thực, server sẽ trả về 401
                alert(data);
                window.location.href = '/';
            }
        });

        async function logout() {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        }
    </script>
</body>
</html>
```

### Cách thức hoạt động

Với `express-session`, thay vì lưu JWT ở client, chúng ta sẽ làm việc với một **ID session** được lưu trữ trong một cookie.

1.  Khi người dùng truy cập `/`, họ sẽ thấy trang đăng nhập.
2.  Sau khi gửi thông tin và đăng nhập thành công, server Express tạo một **session** và lưu trạng thái xác thực (`req.session.isAuthenticated = true`). Server cũng gửi một cookie chứa session ID về trình duyệt.
3.  Trình duyệt lưu cookie này. Mọi yêu cầu tiếp theo từ trình duyệt sẽ tự động gửi cookie này.
4.  Khi người dùng nhấn "Đăng nhập", JavaScript sẽ chuyển hướng họ đến `/admin`.
5.  Server Express nhận yêu cầu `/admin`. Middleware `isAuthenticated` kiểm tra session ID từ cookie. Vì session đã được xác thực, middleware cho phép yêu cầu tiếp tục và server gửi file `admin.html` về.
6.  Nếu người dùng cố gắng truy cập `/admin` mà không có session hợp lệ, middleware sẽ chặn lại và trả về 401.

**Điểm khác biệt chính:**

  * **JWT (Stateless):** Client giữ token và phải gửi nó trong mỗi yêu cầu. Server không lưu trạng thái phiên.
  * **Session (Stateful):** Server lưu trạng thái phiên. Client chỉ giữ một cookie chứa ID session.