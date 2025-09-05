// backend/core/AuthMiddleware.js

class AuthMiddleware {
    constructor() {
        this.authCheck = this.authCheck.bind(this);
    }

    authCheck(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            return res.status(401).json({err: 401});
            //return res.redirect('/logout/');
        }
    }
}

export {AuthMiddleware}