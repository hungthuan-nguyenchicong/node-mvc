// backend/core/ApiUploadNode.js
import multer from 'multer';
import fetch, { FormData, fileFromSync } from 'node-fetch'; // Giữ lại các imports cần thiết
import fs from 'fs'; // Không còn cần thiết nếu chỉ dùng memoryStorage

class ApiUploadNode {
    constructor() {
        // Cấu hình Multer để lưu file trong bộ nhớ
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });
        this.uploadMiddleware = upload.single('file');
        // Lưu ý: đổi từ .fields() sang .single() vì chỉ có một file
    }

    apiUploadPhp() {
        return async (req, res) => {
            const hostPhp = 'http://localhost/api-upload-php/';
            const formData = new FormData();

            // Kiểm tra xem file đã được tải lên và truy cập từ req.file
            if (req.file) {
                const uploadedFile = req.file;
                const mimetype = uploadedFile.mimetype;
                const originalname = uploadedFile.originalname;
                const fileBuffer = uploadedFile.buffer; // Lấy dữ liệu file từ buffer

                // Tạo một Blob từ buffer và tên file để gửi đi
                const blob = new Blob([fileBuffer], { type: mimetype });
                formData.set('file', blob, originalname);
            } else {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            try {
                const response = await fetch(hostPhp, {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();
                console.log(result);

                if (result && result.status === 'success') {
                    // Không cần xóa file vì nó chỉ nằm trong bộ nhớ
                    console.log("File processed successfully by PHP.");
                }

                return res.json(result);

            } catch (error) {
                console.error("Error forwarding file:", error);
                return res.status(500).json({ error: 'Failed to forward file' });
            }
        };
    }
}
export { ApiUploadNode };