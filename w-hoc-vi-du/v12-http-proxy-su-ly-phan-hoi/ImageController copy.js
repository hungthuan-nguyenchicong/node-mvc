// backend/controllers/ImageController.js

class ImageController {
    constructor() {
        this.insert = this.insert.bind(this)
    }

    async insert(req, res, next) {
        // Chỉ xử lý các request POST
        if (req.method === 'GET') {
            try {
                console.log('Đang thực hiện logic database...');
                // --- Ghi dữ liệu vào database ở đây ---
                // const imageController = new ImageController();
                // await imageController.saveImageToDb(req.body);
                // -------------------------------------

                // Giả định rằng việc ghi database thành công
                const isDbWriteSuccessful = true;

                if (isDbWriteSuccessful) {
                    console.log('Ghi database thành công. Chuyển tiếp tới proxy.');
                    // Gọi next() để chuyển request tới middleware tiếp theo (apiProxy)
                    return next();
                } else {
                    // Nếu ghi database thất bại, trả về lỗi ngay lập tức
                    console.log('Ghi database thất bại. Đã dừng request.');
                    return res.status(500).json({ err: 'Failed to write to database' });
                }
            } catch (dbError) {
                console.error('Lỗi database:', dbError);
                // Bắt lỗi và trả về phản hồi lỗi
                return res.status(500).json({ err: 'Internal Server Error', details: dbError.message });
            }
        }

        // Nếu không phải là POST, chỉ gọi next() và trả về JSON cho client
        //next();

        // Nếu không phải là POST, chỉ gọi next()
        return res.status(405).json({ err: 405 });
    }
}

export { ImageController }