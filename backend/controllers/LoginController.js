// backend/controllers/LoginController.js
import { LoginModel } from "../models/LoginModel.js";
class LoginController {
    constructor() {
        // this.req = req;
        // this.res = res;
        this.loginModel = new LoginModel();
    }

    async login(req, res) {
        try {
            const formData = req.body;
            const {username, password} = formData;
            const response = await this.loginModel.validate(username, password);
            if (response) {
                return req.session.regenerate((err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({err: 500});
                    }

                    req.session.user = username;

                    req.session.save((err) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({err:500});
                        } 
                        return res.status(201).json({success: true});
                    });
                });
            } 
            return res.status(401).json({err:401});
        } catch (err) {
            console.log(err);
            return res.status(500).json({err:500});
        }
        //return this.res.json({mess: 'login controller'});
    }

    logout(req, res) {
        req.session.user = null;
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({err:500});
            }
            return res.status(201).json({success: true});
        });
    }
}

export {LoginController}