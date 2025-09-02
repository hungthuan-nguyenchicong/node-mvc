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
};

export {LoginController};