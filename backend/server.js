// backend/server.js

import express from 'express';
import formData from 'express-form-data';

// login
import { LoginController } from './controllers/LoginController.js';

const app = express();
const port = 3000;

// parse data with connect-multiparty. 
app.use(formData.parse());

app.get('/', (req, res) => {
    res.send('hello /');
});
// /auth/login

app.post('/auth/login', (req, res) => {
    const loginControllerInstance = new LoginController(req, res);
    loginControllerInstance.login();
});

app.listen(port, () => {
    console.log(`Server Express đang chạy tại http://localhost:${port}`);
});