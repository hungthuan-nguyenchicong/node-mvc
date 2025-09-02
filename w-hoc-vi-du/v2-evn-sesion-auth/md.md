# package.json
// khởi tạo dự án
npm init -y
// cài đặt các gói dependencies cho dự án
npm install
# express
npm i express

import express from 'express';

// express
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

## use

### static file

app.use('/admin', express.static(path.resolve(process.cwd(), '..', 'admin')));

### method route

app.get('/', (req, res) => {
    res.send('/ pathname');
});


app.post('/auth/login', (req, res) => {
    const loginControllerInstance = new LoginController(req, res);
    loginControllerInstance.login();
});

app.all(/^\/admin\/.*/ , (req, res, next) => {
    const adminControllerInstance = new AdminController(req, res, next);
    adminControllerInstance.isAuthenticated();
    // console.log(path.resolve(process.cwd(), '..', 'dist/admin'))
});

this.res.status(201).json({success: 201});

// send file

const rootFileName = 'frontend/pages/admin/index.html'
        const fileName = path.resolve(process.cwd(), '../', rootFileName);
        console.log(fileName)
        return this.res.sendFile(fileName)

### url pathname

const fullUrl = `${this.req.protocol}://${this.req.headers.host}${this.req.url}`;
        const url = new URL(fullUrl);
        const urlPathname = url.pathname;
        console.log(urlPathname);
        if (urlPathname === '/admin/') {
            return this.adminIndex();
        }
## app.listen(port, hosst, () => {})
app.listen(port, host, () => {
    console.log(`express đang chạy tại:  http://${host}:${port}`);
})

# env

import dotenv from 'dotenv';

## process.env.npm_lifecycle_event

dotenv.config({ path: envFile})

lấy dev built start

import path from 'path';

const envFile = path.resolve(process.cwd(), '../', process.env.npm_lifecycle_event + '.env');

if (process.env.npm_lifecycle_event === 'dev' || process.env.npm_lifecycle_event === 'test') {
    dotenv.config({ path: envFile})
}

## lấy process.env.NODE_ENV

console.log(process.env.NODE_ENV)

console.log(app.get('env'))

### dev.env built.env start.env
NODE_ENV=development
PORT=3000
HOST=localhost
SECRET=secret-dev-env

### pagage.json

npm i concurrently -D

  "scripts": {
    "test": "concurrently \"cd backend && nodemon server.js\" \"vite\"",
    "dev": "concurrently \"cd backend && nodemon server.js\" \"vite\""
  },

# express-form-data

npm i express-form-data

import formData from 'express-form-data';

## app.use(formData.parse());
app.use(formData.parse());

const formData = this.req.body;
        const username = formData.username;
        const password = formData.password;

const formData = this.req.body;
const { username, password } = formData;



# express-session

npm i express-session

import session from 'express-session';

## use express-session
const secret = process.env.SECRET || 'keyboard cat';
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

## middleware to test if authenticated

function isAuthenticated (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login/');
  }
  
}

## login

async login() {
        const formData = this.req.body;
        const { username, password } = formData;
        try {
            const response = this.loginModelInstance.validate(username, password)
            if (response) {
                this.req.session.regenerate((err) => {
                    if (err) {
                      console.error('Session regenerate error:', err);
                      return this.res.status(500).json({ error: 'Internal Server Error' });
                    }
                    this.req.session.user = username;

                    this.req.session.save((err) => {
                        if (err) {
                           console.error('Session save error:', err);
                           return this.res.status(500).json({ error: 'Internal Server Error' });
                        }
                        return this.res.status(201).json({success: 201});
                    });
                });
            } else {
              return this.res.status(401).json({error: 401});
            }
        } catch (e) {
            console.error('Login error:', e);
            return this.res.status(500).json({error: e.message});
        }
    }





