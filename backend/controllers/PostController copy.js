// backend/controllers/PostController.js
import { PostModel } from "../models/PostModel.js";
class PostController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.postMoldeInstance = new PostModel();
    }

    async create() {
        if (this.req.method === "POST") {
            //console.log(this.req.method)
            const formData = this.req.body;
            let { title, description } = formData;
            if (!title || title.trim() === '') {
                return this.res.status(201).json({err:'Title không được để trống'});
            }
            if (!description || description.trim() === '') {
                return this.res.status(201).json({err:'Description không được để trống'});
            }
            try {
                await this.postMoldeInstance.create(title, description);
                //console.log(title, description)
                return this.res.status(201).json({ success: true })
            } catch (err) {
                console.log(err);
                return this.res.status(500).json({ err: err });
            }
        }
        return this.res.status(405).json({ err: true });
    }
}

export { PostController }