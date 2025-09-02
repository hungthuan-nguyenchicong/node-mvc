// backend/server.js
//import dotenv from 'dotenv';
//import path from 'path';
import express from 'express';
//import formData from 'express-form-data';
//import session from 'express-session';


// dotenv
import { Dotenv } from './core/Dotenv.js';
// express-form-data
import { ExpressFormData } from './core/ExpressFormData.js';
// express-session
import { ExpressSession } from './core/ExpressSession.js';

//login 
//import { LoginController } from './controllers/LoginController.js';

// check auth
import { AuthMiddleware } from './core/AuthMiddleware.js';

// project -> /var/www/html/node-mvc
// const pathRoot = path.resolve(process.cwd(), '..');

// // dotenv
// // process.env.npm_lifecycle_event -> dev built
// const runEvent = process.env.npm_lifecycle_event;

// // fileEnv -> npm run dev -> /var/www/html/node-mvc/ -> .dev -> .env 
// // npm run dev -> .dev.env
// const fileEnv = path.join(pathRoot, '.' + runEvent + '.env');

// if (runEvent === 'dev' || runEvent === 'start') {
//     dotenv.config({ path: fileEnv, quiet: true});;
// }
//console.log('run event: ' + process.env.RUN_EVENT)



//console.log('Dot: ' + process.env.NODE_ENV)
// express
const app = express();

// dotenv
new Dotenv();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
//const secret = process.env.SECRET || 'keyboard cat';

// formData
//app.use(formData.parse());
new ExpressFormData(app);

// express-session
new ExpressSession(app);
// const sess = {
//     secret: secret, // Khóa bí mật để ký session ID
//     resave: false, // Không lưu lại session nếu không có thay đổi
//     saveUninitialized: true, // Lưu session mới chưa được khởi tạo
//     cookie: {
//         httpOnly: true, // Ngăn JS client truy cập cookie
//         maxAge: 1000 * 60 * 60 *24 // time 24h
//     }
// }

// // cấu hình dùng https
// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1);
//     sess.cookie.secure = true; // true nếu https
// }

// app.use(session(sess));

// check auth
new AuthMiddleware(app);


app.get('/', (req, res) => {
    res.send('/ pathname /');
});

// login
// app.post('/auth-login/', (req, res) => {
//     const loginControllerInstance = new LoginController(req, res);
//     loginControllerInstance.login();
// });

// app.get('/auth-check/', authMiddlewareInstance.authCheck, (req, res) => {
//     res.status(201).json({authCheck: true});
// });

// app.get('/auth-logout/', (req, res) => {
//     const loginControllerInstance = new LoginController(req, res);
//     loginControllerInstance.logout();
// });

app.listen(port, host, () => {
    console.log(`Express đang chạy tại: http://${host}:${port}`);
});


console.log(process.env.NODE_ENV)