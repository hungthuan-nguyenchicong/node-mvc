// backend/controllers/LoginController.js
import { LoginModel } from "../models/LoginModel.js";
class LoginController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.loginModel = LoginModel();
    }

    async login() {
        try {
            const response = await this.loginModel.validate();
        } catch (err) {
            console.log(err);
            return this.res.status(401).json({err:401});
        }
        //return this.res.json({mess: 'login controller'});
    }
}

export {LoginController}