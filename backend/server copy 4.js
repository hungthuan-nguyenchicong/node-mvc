// backend/server.js
// Luôn import dotenv và khởi tạo ngay đầu file
import dotenv from 'dotenv';
import path from 'path';
//dotenv.config({ path: '../.env' })

import express from 'express';
import formData from 'express-form-data';
import session from 'express-session';


// dev

import { fileURLToPath } from 'url';

// dev
import { createServer } from 'vite';


// login
import { LoginController } from './controllers/LoginController.js';
// admin -> all /admin/.*
import { AdminController } from './controllers/AdminController.js';

// .env
//console.log(path.join(process.cwd(), '../.env'));

// process.env.npm_lifecycle_event -> dev pro test
const envFile = path.resolve(process.cwd(), '../', process.env.npm_lifecycle_event + '.env');
// load .env
if (process.env.npm_lifecycle_event === 'dev' || process.env.npm_lifecycle_event === 'build') {
    dotenv.config({ path: envFile });
}
console.log(envFile)

// dotenv.config({ path: '../.env' });
//dotenv.config({ path: envFile});

console.log(process.env.npm_lifecycle_event)
if (process.env.NODE_ENV === 'development') {
    //dotenv.config({ path: '../.env' })
    console.log(process.env.secret)
}
// Bây giờ các biến môi trường đã có sẵn
const secretSession = process.env.secret || 'my-super-secret-key';
const port = process.env.PORT || 3000;

console.log('Secret Session:', secretSession);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Port:', port);

const app = express();
//const port = 3000;

// .env
// const secretSession = 'my-super-secret-key'; // Khóa bí mật để ký session ID
// if (process.env.NODE_ENV === 'development') {
//     secretSession = process.env.secret;
// }

console.log(secretSession);
console.log(process.env.NODE_ENV)

// .env
// const secretSession = 'my-super-secret-key'; // Khóa bí mật để ký session ID
// if (import.meta.env.NODE_ENV === 'production') {
//     secretSession = import.meta.env.VITE_SECRET;
// }

// console.log(secretSession)
// session express
// app.use(session({

// }));

// path->file->server.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// pathname
// const url = new URL(import.meta.url);
// const pathname = window.location.href;

//console.log(pathname)

// Correct order: 
// 1. Vite middleware for development
if (import.meta.hot && import.meta.hot.env.NODE_ENV === 'develop') {
    let vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });
    app.use(vite.middlewares);
}

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

// 2. Request body parsers and other middleware
app.use(formData.parse());

// 3. Your API routes
app.get('/', (req, res) => {
    res.send('hello /');
});
app.post('/auth/login', (req, res) => {
    const loginControllerInstance = new LoginController(req, res);
    loginControllerInstance.login();
});
app.all(/^\/admin\/.*/, (req, res) => {
    // console.log(req.path);
    // console.log(req.method);
    // res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    const adminControllerInstance = new AdminController(req, res);
    adminControllerInstance.admin();
});

// 4. Fallback for static assets in production
app.use(express.static('dist'));

app.listen(port, () => {
    console.log(`Server Express đang chạy tại http://localhost:${port}`);
});