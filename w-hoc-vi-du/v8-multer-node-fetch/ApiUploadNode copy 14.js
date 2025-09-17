// Cài đặt: npm install express-form-data
import expressFormData from 'express-form-data';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
const pathRoot = path.resolve(process.cwd(), '..');

const options = {
    uploadDir: path.join(pathRoot, 'temp_uploads'),
    autoClean: false // Giữ lại tệp để kiểm tra
};

function ApiUploadExpressFormData() {
    return (req, res, next) => {
        console.log('--- New Upload Request Received via express-form-data ---');

        if (!req.files) {
            console.log('express-form-data did not find any files.');
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const form = new FormData();

        // Xử lý các tệp đã tải lên
        const fileKeys = Object.keys(req.files);
        if (fileKeys.length === 0) {
            console.log('No files found in req.files.');
            return res.status(400).json({ error: 'No files found in upload.' });
        }

        fileKeys.forEach(key => {
            const file = req.files[key];
            console.log(`✅ express-form-data successfully processed file: ${file.path}`);
            console.log(`- Original name: ${file.name}`);
            form.append(key, fs.createReadStream(file.path), {
                filename: file.name,
                contentType: file.type,
            });
        });

        // Thêm các trường dữ liệu khác
        for (const key in req.body) {
            form.append(key, req.body[key]);
            console.log(`- Appended field: ${key}`);
        }

        console.log('Preparing to send to PHP backend...');
        fetch('http://localhost/api-upload-php/', {
            method: 'POST',
            body: form,
            ...form.getHeaders()
        }).then(phpResponse => {
            return phpResponse.json();
        }).then(responseData => {
            // console.log(`Response received from PHP. Status: ${res.status}`);
            // console.log('PHP Response Data:', responseData);
            res.status(200).json(responseData);
        }).catch(error => {
            console.error('Fetch to PHP failed:', error);
            res.status(500).json({ error: 'Proxying to PHP failed' });
        });
    };
}

// Cách sử dụng: app.post('/api-upload-node/', expressFormData.parse(options), ApiUploadExpressFormData());
export { ApiUploadExpressFormData, expressFormData, options };