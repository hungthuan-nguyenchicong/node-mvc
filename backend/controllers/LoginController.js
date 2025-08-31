// backend/controllers/LoginController.js

class LoginController {
    constructor(req, res) {
        this.res = res
        this.req = req;
    }

    login() {
        const formData = this.req.body;
        console.log(formData);
        return this.res.json({mess:formData});
    }
};

export {LoginController};