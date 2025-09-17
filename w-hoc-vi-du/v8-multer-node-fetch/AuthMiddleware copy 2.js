// backend/core/AuthMiddleware.js
import { LoginController } from "../controllers/LoginController.js";
// api admin
import { ApiAdmin } from "./ApiAdmin.js";
// api-upload-node
//import { ApiUploadNode } from "./ApiUploadNode.js";
import { ApiUploadNode } from "./ApiUploadNode.js"; // Import both `upload` and `ApiUploadNode`

//import { ApiUploadNode, upload } from "./ApiUploadNode.js"; // Import both `upload` and `ApiUploadNode`
class AuthMiddleware {
    constructor(app) {
        this.loginControllerInstance = new LoginController();
        //this.apiAdminInstance = new ApiAdmin();
        //this.authCheck = this.authCheck.bind(this);
        this.login(app);
        this.check(app);
        this.logout(app);
        this.apiAdmin(app);
        this.apiUploadNode(app);
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

    // them this.authCheck
    check(app) {
        app.post('/auth-check/', (req, res) => {
            res.status(201).json({ authCheck: true });
        });
    }

    logout(app) {
        app.post('/auth-logout/', (req, res) => {
            this.loginControllerInstance.logout(req, res);
        });
    }
    // them this.authCheck
    apiAdmin(app) {
        app.use('/api-admin/', (req, res) => {
            //this.apiAdminInstance.init(req, res);
            new ApiAdmin(req, res)
        })
    }

    // apiUploadNode(app) {
    //     app.post('/api-upload-node/', (req, res) => {
    //         //res.json({ upload: 'ok' });
    //         //new ApiUploadNode(req, res);
    //         new ApiUploadNode();
    //     })
    // }

    // apiUploadNode(app) {
    //     app.post('/api-upload-node/', new ApiUploadNode())
    // }

    // apiUploadNode(app) {
    //     // Create an instance of the ApiUploadNode class
    //     const apiUploadInstance = new ApiUploadNode();

    //     // Pass the middleware function from the instance to app.post()
    //     app.post('/api-upload-node/', apiUploadInstance.getMiddleware());
    // }

    // 
    // apiUploadNode(app) {
    //     // Correctly pass the function to the route handler.
    //     // Express will automatically call this function when a POST request is made to this route.
    //     app.post('/api-upload-node/', ApiUploadNode());
    // }

    // Cách sử dụng: app.post('/api-upload-node/', upload.single('file'), ApiUploadMulter());

    // apiUploadNode(app) {
    //     // Correctly pass the function to the route handler.
    //     // Express will automatically call this function when a POST request is made to this route.
    //     app.post('/api-upload-node/', ApiUploadNode());
    // }

    apiUploadNode(app) {
        const apiUploadNodeInstance = new ApiUploadNode();
        // Correctly pass the function to the route handler.
        // Express will automatically call this function when a POST request is made to this route.
        app.post('/api-upload-node/', apiUploadNodeInstance.uploadMiddleware, apiUploadNodeInstance.apiUploadPhp());
    }


    // apiUploadNode(app) {
    //     // Use the `upload` middleware first, then the `ApiUploadNode` proxy middleware.
    //     // `upload.single('file')` processes a single file with the name 'file'.
    //     app.post('/api-upload-node/', upload.single('file'), ApiUploadNode());
    // }

    // apiUploadNode(app) {
    //     app.post('/api-upload-node/', (req, res, next) => {
    //         console.log('Middleware của multer đang chạy...');
    //         next();
    //     }, upload.single('file'), ApiUploadNode());
    // }
    // apiUploadNode(app) {
    //     // app.post('/api-upload-node/', (req, res, next) => {
    //     //     console.log('Middleware của multer đang chạy...');
    //     //     next();
    //     // }, upload.single('file'), ApiUploadNode());
    //     // app.post('/api-upload-node/', (req, res) => {
    //     //     res.json({ od: 'ok' })
    //     // })

    //     app.post('/api-upload-node/', upload.single('file'), ApiUploadNode());
    // }
    // apiUploadNode(app) {
    //     // This log will confirm that the route is being defined.
    //     console.log('Setting up /api-upload-node/ route.');

    //     app.post('/api-upload-node/', (req, res, next) => {
    //         // This log will confirm the request is reaching the route.
    //         console.log('Request received at /api-upload-node/.');
    //         next();
    //     }, upload.single('file'), ApiUploadNode());
    // }
}

export { AuthMiddleware }