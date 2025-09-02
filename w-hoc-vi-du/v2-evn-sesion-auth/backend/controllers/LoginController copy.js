// backend/controllers/LoginController.js
import { LoginModel } from "../models/LoginModel.js";
class LoginController {
    constructor(req, res) {
        this.res = res
        this.req = req;
        this.loginModelInstance = new LoginModel();
    }

    async login() {
        const formData = this.req.body;
        const username = formData.username;
        const password = formData.password;
        try {
            //console.log(password);
            const response = this.loginModelInstance.validate(username, password)
            if (response) {
                this.req.session.isLoggedIn = true;
                return this.res.status(201).json({success: 201});
            }
            return this.res.status(401).json({error: 401});
        } catch (e) {
            console.error(e);
            return this.req.status(500).json({error: e});
        }
    }
};

export {LoginController};