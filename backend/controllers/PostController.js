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
                return this.res.status(201).json({ err: 'Title không được để trống' });
            }
            if (!description || description.trim() === '') {
                return this.res.status(201).json({ err: 'Description không được để trống' });
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

    async show_posts() {
        try {
            const result = await this.postMoldeInstance.show_posts();
            if (result) {
                //console.log(result)
                return this.res.status(201).json(result);
            }
            return this.res.status(500).json({ err: true });
        } catch (err) {
            console.log(err);
            return this.res.status(500).json({ err: err });
        }
    }

    async show_post(params = {}) {
        const { id = null } = params;
        //console.log(params)
        // Check if the ID is a valid number
        const numericId = parseInt(id, 10);
        if (isNaN(numericId) || !numericId) {
            return this.res.status(201).json({ err: `Vui lòng truyền &id=number` });
        }
        try {
            const result = await this.postMoldeInstance.show_post(id);
            if (result && result.length > 0) {
                //console.log(result[0])
                return this.res.status(201).json(result[0]);
            }
            return this.res.status(201).json({ err: `show post: ${id} không tồn tại` });
        } catch (err) {
            console.log(err);
            return this.res.status(500).json({ err: err });
        }
    }
    // update_post(postId, postTitle, postDescription)
    async update_post(params = {}) {
        if (this.req.method === 'PUT') {
            const { id = null } = params;
            //console.log(id)
            // Check if the ID is a valid number
            const numericId = parseInt(id, 10);
            if (isNaN(numericId), !numericId) {
                return this.res.status(201).json({ err: `Vui truyền &id=number` });
            }
            try {
                const formData = this.req.body;
                const { title, description } = formData;
                // const newObject = { id, title, description };
                // console.log(formData)
                // console.log(newObject)
                const result = await this.postMoldeInstance.update_post(id, title, description);

                if (result && result.length > 0) {
                    //console.log(result)
                    return this.res.status(201).json({success:true});
                }
                return this.res.status(201).json({id, title, description})
            } catch (err) {
                console.error(err);
                //throw err;
                return this.res.status(500).json({ err: 500 });
            }
        }
        return this.res.status(405).json({ err: 405 });
    }

    async delete_post(params = {}) {
        const {id = null} = params;
        if (this.req.method === "DELETE") {
            try {
                const result = await this.postMoldeInstance.delete_post(id);
                if (result && result.length >0) {
                    return this.res.status(201).json({success:true});
                }
            } catch (err) {
                console.error(err);
                return this.res.status(500).json({err:true});
            }
        }
        this.res.status(405).json({err:true});
    }
}

export { PostController }