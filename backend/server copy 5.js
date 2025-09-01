// backend/server.js

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import formData from 'express-form-data';
import session from 'express-session';

// load controller
import { LoginController } from './controllers/LoginController.js';
// admin controller
import { AdminController } from './controllers/AdminController.js';

// process.env.npm_lifecycle_event -> dev build start
const envFile = path.resolve(process.cwd(), '../', process.env.npm_lifecycle_event + '.env');
if (process.env.npm_lifecycle_event === 'dev' || process.env.npm_lifecycle_event === 'test') {
    dotenv.config({ path: envFile})
}

// express
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const secret = process.env.SECRET || 'keyboard cat';

// get env
//console.log(process.env.NODE_ENV)
//console.log(app.get('env'))

// load formData
// parse data with connect-multiparty. -->> remove options
app.use(formData.parse());

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

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true; // Đặt là true nếu dùng HTTPS
}

app.use(session(sess));
//console.log(sess)

// run express
app.get('/', (req, res) => {
    res.send('/ pathname');
});

// login -> post auth/login
app.post('/auth/login', (req, res) => {
    const loginControllerInstance = new LoginController(req, res);
    loginControllerInstance.login();
});

// admin/.*
app.all(/^\/admin\/.*/, (req, res, next) => {
    const adminControllerInstance = new AdminController(req, res, next);
    adminControllerInstance.isAuthenticated();
});

app.listen(port, host, () => {
    console.log(`express đang chạy tại:  http://${host}:${port}`);
})

//console.log(process.env.HOST)