// backend/controllers/ImageController.js
import { ImageModel } from "../models/ImageModel.js";
class ImageController {
    constructor() {
        this.insert = this.insert.bind(this);
        this.delete = this.delete.bind(this);
        this.imageModelInstance = new ImageModel();
    }

    async insert(req, res, next) {
        //console.log(req.headers)
        // Chỉ xử lý các request POST
        if (req.method === 'POST') {
            try {
                const imageName = req.get('x-file-name');
                const imageSrc = '/uploads/' + imageName;
                const imageInsertId = await this.imageModelInstance.insert_image(imageSrc);
                //console.log(imageInsertId);
                if (imageInsertId) {
                    req.imageInsertId = imageInsertId;
                }
                return next();
            } catch (err) {
                console.error('Lỗi database:', err);
                if (err.errno === 1062) {
                    return res.status(201).json({ err: 'File đã tồn tại vui lòng đổi tên file hoặc chọn file khác' });
                }
                // Bắt lỗi và trả về phản hồi lỗi
                return res.status(500).json({ err: 500 });
            }
        }

        // Nếu không phải là POST, chỉ gọi next() và trả về JSON cho client
        //next();

        // Nếu không phải là POST, chỉ gọi next()
        return res.status(405).json({ err: 405 });
    }

    async delete(req, res) {
        if (req.method === 'DELETE') {
            const imageId = req.query.imageId;
            if (imageId) {
                //console.log(imageId);
                try {
                    await this.imageModelInstance.delete_image(imageId);
                    return res.status(201).json({ delete: 'ok' })
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({ err: err });
                }
            }
            return res.status(500).json({ err: 500 });
        }
        return res.status(405).json({ err: 405 });
    }
}

export { ImageController }