// Cài đặt: npm install multer
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Tạo một thư mục tạm để Multer lưu tệp.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathRoot = path.resolve(process.cwd(), '..');
        const uploadDir = path.join(pathRoot, 'temp_uploads');
        fs.promises.mkdir(uploadDir, { recursive: true }).then(() => {
            cb(null, uploadDir);
        }).catch(err => {
            console.error('Failed to create upload directory for Multer:', err);
            cb(err);
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Sử dụng Multer như một middleware độc lập để xử lý tệp
const upload = multer({ storage: storage }).single('file');

function ApiUploadMulterProxy() {
    return (req, res, next) => {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Multer processing error:', err);
                return res.status(500).json({ error: 'File upload failed.' });
            }

            console.log('--- New Upload Request Received via Multer ---');
            if (!req.file) {
                console.log('Multer did not find a file. Request body:', req.body);
                return res.status(400).json({ error: 'No file uploaded by Multer.' });
            }

            console.log('✅ Multer successfully processed and saved file locally.');
            console.log(`- File path: ${req.file.path}`);
            console.log(`- Original name: ${req.file.originalname}`);

            const form = new FormData();
            form.append('file', fs.createReadStream(req.file.path), {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });

            for (const key in req.body) {
                form.append(key, req.body[key]);
                console.log(`- Appended field: ${key}`);
            }

            console.log('Preparing to send to PHP backend...');
            try {
                const phpResponse = await fetch('http://localhost/api-upload-php/', {
                    method: 'POST',
                    body: form,
                    ...form.getHeaders()
                });

                const responseText = await phpResponse.text();
                try {
                    const responseData = JSON.parse(responseText);
                    console.log(`Response received from PHP. Status: ${phpResponse.status}`);
                    console.log('PHP Response Data:', responseData);
                    res.status(phpResponse.status).json(responseData);
                } catch (jsonError) {
                    console.log(`JSON parsing failed. Status: ${phpResponse.status}`);
                    console.log('Raw PHP Response:', responseText);
                    res.status(500).json({ error: 'Invalid JSON response from PHP', debugInfo: responseText });
                }
            } catch (error) {
                console.error('Fetch to PHP failed:', error);
                res.status(500).json({ error: 'Proxying to PHP failed' });
            }
        });
    };
}

export { ApiUploadMulterProxy };