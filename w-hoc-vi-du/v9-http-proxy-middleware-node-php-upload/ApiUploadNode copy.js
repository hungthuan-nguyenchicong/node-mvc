// backend/core/ApiUploadNode.js
import multer from 'multer';
import fetch, { FormData, fileFromSync } from 'node-fetch';
import fs from 'fs'; // Import the file system module

class ApiUploadNode {
    constructor() {
        // ... (your existing multer configuration is correct)
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });
        const upload = multer({ storage: storage });
        this.uploadMiddleware = upload.fields([{ name: 'file', maxCount: 1 }]);
    }

    apiUploadPhp() {
        return async (req, res) => {
            const hostPhp = 'http://localhost/api-upload-php/';
            const formData = new FormData();

            if (req.files && req.files.file && req.files.file[0]) {
                const uploadedFile = req.files.file[0];
                const mimetype = uploadedFile.mimetype;
                const filePath = uploadedFile.path;
                const blob = fileFromSync(filePath, mimetype);
                formData.set('file', blob);
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

                // Check if the file was processed successfully by the PHP server
                if (result && result.status === 'success') {
                    // Delete the temporary file
                    fs.unlink(req.files.file[0].path, (err) => {
                        if (err) {
                            console.error("Error deleting temporary file:", err);
                        } else {
                            console.log("Temporary file deleted successfully:", req.files.file[0].path);
                        }
                    });
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