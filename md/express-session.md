# express-session

npm i express-session

import session from 'express-session';

.env
SECRET

const secret = process.env.SECRET || 'keyboard cat';

## use // express-session

// express-session
const sess = {
    secret: secret, // Khóa bí mật để ký session ID
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: true, // Lưu session mới chưa được khởi tạo
    cookie: {
        httpOnly: true, // Ngăn JS client truy cập cookie
        maxAge: 1000 * 60 * 60 * 24 // Thời gian sống của session (24h)
    }
}
// cấu hình dùng https
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true; // Đặt là true nếu dùng HTTPS
}

app.use(session(sess));

## class AuthMiddleware

// backend/core/AuthMiddleware.js

class AuthMiddleware {
    constructor() {
        this.checkAuth = this.checkAuth.bind(this);
    }

    authCheck(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            return res.status(401).json({err: 401});
            //return res.redirect('/logout/');
        }
    }
}

export {AuthMiddleware}

## use AuthMiddleware

import { AuthMiddleware } from './core/AuthMiddleware.js';

const authMiddlewareInstance = new AuthMiddleware();

app.get('/auth-check/', authMiddlewareInstance.authCheck, (req, res) => {
    res.status(201).json({authCheck: true});
});



