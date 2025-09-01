// backend/controllers/AdminController.js
//import url from 'url';
import path from 'path';

class AdminController {
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    isAuthenticated() {
        // if (this.req.session.user) {
        //     // Nếu đã xác thực, chuyển sang middleware hoặc route handler tiếp theo
        //     console.log('User is authenticated:', this.req.session.user);
        //     console.log(this.req.url)

        //     this.res.send('isAuthenticated');
        //     this.next();
        // } else {
        //     // Nếu chưa, chuyển hướng về trang đăng nhập
        //     console.log('User is not authenticated.');
        //     this.res.redirect('/login/');
        // }

        // logic
        //console.log(this.req.url);
        // Inside your route handler
        // const parsedUrl = url.parse(this.req.url);
        // console.log(parsedUrl.pathname); // Logs the pathname part of the URL
        // req.headers.host gets the host and port (e.g., 'localhost:3000').
        const fullUrl = `${this.req.protocol}://${this.req.headers.host}${this.req.url}`;
        const url = new URL(fullUrl);
        const urlPathname = url.pathname;
        console.log(urlPathname);
        if (urlPathname === '/admin/') {
            return this.adminIndex();
        }

        if (urlPathname === '/admin/api/') {
            return this.res.send('/admin/api/');
        }
        return this.res.send(`${this.req.url}`)
    }

    adminIndex() {
        const rootFileName = 'frontend/pages/admin/index.html'
        const fileName = path.resolve(process.cwd(), '../', rootFileName);
        console.log(fileName)
        return this.res.sendFile(fileName)
    }

    adminApi() {
        return this.res.send('/admin/api/');
    }
}

export { AdminController }