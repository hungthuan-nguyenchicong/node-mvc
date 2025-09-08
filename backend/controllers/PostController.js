// backend/controllers/PostController.js

class PostController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    create() {
        return this.res.json({create:true})
    }
}

export {PostController}