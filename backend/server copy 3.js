// backend/server.js

import express from 'express';
import formData from 'express-form-data';
import path from 'path';
import { fileURLToPath } from 'url';

// dev
import { createServer } from 'vite';


// login
import { LoginController } from './controllers/LoginController.js';
// admin -> all /admin/.*
import { AdminController } from './controllers/AdminController.js';

const app = express();
const port = 3000;

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