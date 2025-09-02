// backend/server.js
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import formData from 'express-form-data';


//login 
import { LoginController } from './controllers/LoginController.js';

// project -> /var/www/html/node-mvc
const pathRoot = path.resolve(process.cwd(), '..');

// dotenv
// process.env.npm_lifecycle_event -> dev built
const runEvent = process.env.npm_lifecycle_event;

// fileEnv -> npm run dev -> /var/www/html/node-mvc/ -> .dev -> .env 
// npm run dev -> .dev.env
const fileEnv = path.join(pathRoot, '.' + runEvent + '.env');

if (runEvent === 'dev' || runEvent === 'start') {
    dotenv.config({ path: fileEnv, quiet: true});;
}
//console.log('run event: ' + process.env.RUN_EVENT)

// express
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// formData
app.use(formData.parse());

app.get('/', (req, res) => {
    res.send('/ pathname /');
});

// login
app.post('/auth/login', (req, res) => {
    const loginControllerInstance = new LoginController(req, res);
    loginControllerInstance.login();
});

app.listen(port, host, () => {
    console.log(`Express đang chạy tại: http://${host}:${port}`);
});


console.log(process.env.NODE_ENV)