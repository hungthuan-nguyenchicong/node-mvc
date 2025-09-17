import Busboy from 'busboy';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

function ApiUploadNode() {
    return (req, res, next) => {
        console.log('--- New Upload Request Received ---');
        console.log(`Content-Type: ${req.headers['content-type']}`);
        if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
            console.log('Error: Unsupported content type');
            return res.status(400).json({ error: 'Unsupported content type' });
        }

        const busboy = Busboy({ headers: req.headers });
        const form = new FormData();
        // project -> /var/www/html/node-mvc
        const pathRoot = path.resolve(process.cwd(), '..');
        const uploadDir = path.join(pathRoot, 'temp_uploads'); // Thư mục tạm để lưu file

        const parsePromise = new Promise(async (resolve, reject) => {
            // Đảm bảo thư mục tồn tại
            try {
                await fs.promises.mkdir(uploadDir, { recursive: true });
            } catch (err) {
                console.error('Failed to create upload directory:', err);
                return reject(err);
            }

            // Ghi nhận file đã được lưu
            let fileSaved = false;

            busboy.on('file', (fieldname, fileStream, file) => {
                console.log(`-> Busboy 'file' event triggered for field: ${fieldname}`);
                console.log(`   - File Name: ${file.filename}`);
                console.log(`   - MIME Type: ${file.mimeType}`);

                const filePath = path.join(uploadDir, file.filename);
                const writeStream = fs.createWriteStream(filePath);

                fileStream.pipe(writeStream);

                writeStream.on('finish', () => {
                    console.log(`✅ File saved locally at: ${filePath}`);
                    // Thêm file đã lưu vào FormData
                    form.append(fieldname, fs.createReadStream(filePath), {
                        filename: file.filename,
                        contentType: file.mimeType,
                    });
                    fileSaved = true;
                });

                fileStream.on('error', (err) => {
                    console.error('File stream error:', err);
                    reject(err);
                });
            });

            busboy.on('field', (fieldname, value) => {
                console.log(`-> Busboy 'field' event triggered for field: ${fieldname}`);
                console.log(`   - Field Value: ${value}`);
                form.append(fieldname, value);
            });

            busboy.on('finish', () => {
                console.log('-> Busboy ' + 'finish' + ' event triggered. All parts processed.');
                if (fileSaved) {
                    resolve(form);
                } else {
                    // Xử lý trường hợp không có file nào được gửi
                    resolve(form);
                }
            });

            busboy.on('error', (err) => {
                console.error('Busboy parsing error:', err);
                reject(err);
            });

            console.log('Piping request to Busboy for parsing...');
            req.pipe(busboy);
        });

        parsePromise
            .then(async (parsedForm) => {
                console.log('Busboy parsing complete. Preparing to send to PHP backend...');
                try {
                    const phpResponse = await fetch('http://localhost/api-upload-php/', {
                        method: 'POST',
                        body: parsedForm,
                        headers: parsedForm.getHeaders(),
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
            })
            .catch((error) => {
                console.error('Busboy Promise catch block triggered:', error);
                res.status(500).json({ error: 'Request parsing failed' });
            });
    };
}

export { ApiUploadNode };