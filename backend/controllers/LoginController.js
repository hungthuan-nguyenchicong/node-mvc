// backend/controllers/LoginController.js

class LoginController {
    constructor(req, res) {
        this.res = res
        this.req = req;
    }

    async login() {
        try {
            const formData = this.req.body;
            console.log(formData);
            return this.res.json({mess:formData});

        } catch (e) {
            console.error(e);
            
        }
    }
};

export {LoginController};