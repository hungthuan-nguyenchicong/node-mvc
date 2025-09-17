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

const upload = multer({ storage: storage });

function ApiUploadMulter() {
    return (req, res, next) => {
        console.log('--- New Upload Request Received via Multer ---');

        // Multer đã xử lý tệp và lưu nó vào req.file
        if (!req.file) {
            console.log('Multer did not find a file. Request body:', req.body);
            return res.status(400).json({ error: 'No file uploaded by Multer.' });
        }

        console.log('✅ Multer successfully processed and saved file locally.');
        console.log(`- File path: ${req.file.path}`);
        console.log(`- Original name: ${req.file.originalname}`);

        // Chuẩn bị FormData để chuyển tiếp tệp
        const form = new FormData();
        form.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // Thêm các trường dữ liệu khác nếu có
        for (const key in req.body) {
            form.append(key, req.body[key]);
            console.log(`- Appended field: ${key}`);
        }

        // Gửi yêu cầu đến PHP
        console.log('Preparing to send to PHP backend...');
        fetch('http://localhost/api-upload-php/', {
            method: 'POST',
            body: form,
            ...form.getHeaders()
        }).then(phpResponse => {
            return phpResponse.json();
        }).then(responseData => {
            console.log(`Response received from PHP. Status: ${res.status}`);
            console.log('PHP Response Data:', responseData);
            res.status(res.status).json(responseData);
        }).catch(error => {
            console.error('Fetch to PHP failed:', error);
            res.status(500).json({ error: 'Proxying to PHP failed' });
        });
    };
}

// Cách sử dụng: app.post('/api-upload-node/', upload.single('file'), ApiUploadMulter());
export { ApiUploadMulter, upload };