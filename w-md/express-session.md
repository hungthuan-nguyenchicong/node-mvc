# express-session

npm install express-session

import session from 'express-session';

## // Cấu hình session
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

## // Middleware kiểm tra trạng thái đăng nhập
const isAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next(); // Đã đăng nhập, cho phép tiếp tục
    } else {
        res.redirect('/login'); // Chưa đăng nhập, chuyển hướng
    }
};

## // Route hiển thị trang login
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
##
