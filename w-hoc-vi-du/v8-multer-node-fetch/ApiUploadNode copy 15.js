import Busboy from 'busboy';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

function ApiUploadNode() {
    return (req, res, next) => {
        console.log('--- New Upload Request Received ---');
        if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
            console.log('Error: Unsupported content type');
            return res.status(400).json({ error: 'Unsupported content type' });
        }

        const busboy = Busboy({ headers: req.headers });
        const form = new FormData();
        const pathRoot = path.resolve(process.cwd(), '..');
        const uploadDir = path.join(pathRoot, 'temp_uploads');

        const promises = [];

        const parsePromise = new Promise(async (resolve, reject) => {
            try {
                await fs.promises.mkdir(uploadDir, { recursive: true });
            } catch (err) {
                console.error('Failed to create upload directory:', err);
                return reject(err);
            }

            busboy.on('file', (fieldname, fileStream, file) => {
                const promise = new Promise((fileResolve, fileReject) => {
                    console.log(`-> Busboy 'file' event triggered for field: ${fieldname}`);
                    const filePath = path.join(uploadDir, file.filename);
                    const writeStream = fs.createWriteStream(filePath);
                    fileStream.pipe(writeStream);

                    writeStream.on('finish', () => {
                        console.log(`✅ File saved locally at: ${filePath}`);
                        // Thêm tệp đã lưu dưới dạng luồng có thể đọc được vào FormData
                        form.append(fieldname, fs.createReadStream(filePath), {
                            filename: file.filename,
                            contentType: file.mimeType,
                        });
                        fileResolve();
                    });

                    fileStream.on('error', (err) => {
                        console.error('File stream error:', err);
                        fileReject(err);
                    });
                });
                promises.push(promise);
            });

            busboy.on('field', (fieldname, value) => {
                console.log(`-> Busboy 'field' event triggered for field: ${fieldname}`);
                form.append(fieldname, value);
            });

            busboy.on('finish', async () => {
                console.log('-> Busboy ' + 'finish' + ' event triggered. Waiting for file uploads to complete.');
                try {
                    await Promise.all(promises);
                    console.log('All local file writes are complete. Resolving promise.');
                    resolve(form);
                } catch (err) {
                    console.error('An error occurred during file writing:', err);
                    reject(err);
                }
            });

            busboy.on('error', (err) => {
                console.error('Busboy parsing error:', err);
                reject(err);
            });
            req.pipe(busboy);
        });

        parsePromise
            .then(async (parsedForm) => {
                console.log('Busboy parsing complete. Preparing to send to PHP backend...');
                try {
                    const phpResponse = await fetch('http://localhost/api-upload-php/', {
                        method: 'POST',
                        body: parsedForm,
                        // Thêm headers cho FormData để đảm bảo việc chuyển tiếp thành công
                        ...parsedForm.getHeaders()
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