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

            // Check if a file was uploaded and get its information
            if (req.files && req.files.file && req.files.file[0]) {
                const uploadedFile = req.files.file[0];

                // Read the file data and append it to FormData
                const fileStream = fs.createReadStream(uploadedFile.path);

                // Note: fileFromSync is an alternative for node-fetch >= 3.0.0
                // For node-fetch < 3.0.0, you would use a different method.
                // Assuming you have node-fetch v3 or later
                formData.set('file', fileFromSync(uploadedFile.path, uploadedFile.mimetype));
                // Or for versions of node-fetch without fileFromSync, you can use:
                // formData.append('file', fileStream, uploadedFile.originalname);

                // Add any other fields if needed
                formData.set('other_field', 'some_value');

            } else {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            try {
                const response = await fetch(hostPhp, {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();
                console.log(result)
                // You can also delete the temporary file after it's been sent
                // fs.unlink(req.files.file[0].path, (err) => {
                //    if (err) console.error(err);
                // });

                return res.json(result);

            } catch (error) {
                console.error("Error forwarding file:", error);
                return res.status(500).json({ error: 'Failed to forward file' });
            }
        };
    }

    // registerRoutes(app) {
    //     app.post('/api-upload-node/', this.uploadMiddleware, this.apiUploadPhp());
    // }
}

// Function to set up the route
// function apiUploadNode(app) {
//     const apiUploadNodeInstance = new ApiUploadNode();
//     apiUploadNodeInstance.registerRoutes(app);
// }

export { ApiUploadNode };