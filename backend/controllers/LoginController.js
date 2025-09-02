// backend/controllers/LoginController.js
import { LoginModel } from "../models/LoginModel.js";
class LoginController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.loginModel = new LoginModel();
    }

    async login() {
        try {
            const formData = this.req.body;
            const {username, password} = formData;
            const response = await this.loginModel.validate(username, password);
            if (response) {
                return this.res.status(201).json({mess:username})
            }
            return this.res.status(401).json({err:401});
        } catch (err) {
            console.log(err);
            return this.res.status(500).json({err:500});
        }
        //return this.res.json({mess: 'login controller'});
    }
}

export {LoginController}