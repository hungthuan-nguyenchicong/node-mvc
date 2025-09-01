// backend/controllers/AdminController.js

class AdminController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    admin() {
        return this.res.send('AdminController')
    }
}

export { AdminController }