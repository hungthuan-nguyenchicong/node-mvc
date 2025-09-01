// backend/controllers/AdminController.js

class AdminController {
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    isAuthenticated() {
        if (this.req.session.isLoggedIn) {
            this.next();
            console.log(this.req.session.isLoggedIn);
            this.res.send('session - ok')
        } else {
            this.res.redirect('/login/');
        }
    }
}

export { AdminController }