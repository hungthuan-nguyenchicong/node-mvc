// backend/core/AuthMiddleware.js
import { LoginController } from "../controllers/LoginController.js";
// api admin
import { ApiAdmin } from "./ApiAdmin.js";
class AuthMiddleware {
    constructor(app) {
        this.loginControllerInstance = new LoginController();
        //this.apiAdminInstance = new ApiAdmin();
        //this.authCheck = this.authCheck.bind(this);
        this.login(app);
        this.check(app);
        this.logout(app);
        this.apiAdmin(app);
    }

    authCheck(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            return res.status(401).json({ err: 401 });
            //return res.redirect('/logout/');
        }
    }

    login(app) {
        app.post('/auth-login/', (req, res) => {
            //const loginControllerInstance = new LoginController(req, res);
            return this.loginControllerInstance.login(req, res);
        });
    }

    check(app) {
        app.post('/auth-check/', this.authCheck, (req, res) => {
            res.status(201).json({ authCheck: true });
        });
    }

    logout(app) {
        app.post('/auth-logout/', (req, res) => {
            this.loginControllerInstance.logout(req, res);
        });
    }

    apiAdmin(app) {
        app.use('/api-admin/', this.authCheck, (req, res) => {
            //this.apiAdminInstance.init(req, res);
            new ApiAdmin(req, res)
        })
    }
}

export { AuthMiddleware }