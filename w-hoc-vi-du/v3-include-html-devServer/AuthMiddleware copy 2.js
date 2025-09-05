// backend/core/AuthMiddleware.js
import { LoginController } from "../controllers/LoginController.js";
class AuthMiddleware {
    constructor(app) {
        this.loginControllerInstance = new LoginController();
        //this.authCheck = this.authCheck.bind(this);
        this.login(app);
        this.check(app);
        this.logout(app);
    }

    authCheck(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            return res.status(401).json({err: 401});
            //return res.redirect('/logout/');
        }
    }

    login(app) {
        app.post('/auth-login/', (req, res) => {
            //const loginControllerInstance = new LoginController(req, res);
            this.loginControllerInstance.login(req, res);
        });
    }

    check(app) {
        app.post('/auth-check/', this.authCheck, (req, res) => {
            res.status(201).json({authCheck: true});
        });
    }

    logout(app) {
        app.post('/auth-logout/', (req, res) => {
            this.loginControllerInstance.logout(req, res);
        });
    }
}

export {AuthMiddleware}