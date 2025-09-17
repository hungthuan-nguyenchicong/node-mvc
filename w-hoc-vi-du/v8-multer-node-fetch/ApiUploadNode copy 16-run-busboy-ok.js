// Cài đặt: npm install busboy node-fetch
import Busboy from 'busboy';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// This is the complete, self-contained function
function ApiUploadNodeModern() {
    return (req, res) => {
        console.log('--- New Upload Request Received ---');

        const pathRoot = path.resolve(process.cwd(), '..');
        const uploadDir = path.join(pathRoot, 'temp_uploads');

        const busboy = Busboy({ headers: req.headers });
        const promises = [];
        let fileData = null; // Store file data here

        busboy.on('file', (fieldname, fileStream, file) => {
            console.log(`-> Busboy 'file' event triggered for field: ${fieldname}`);
            const filePath = path.join(uploadDir, file.filename);
            const writeStream = fs.createWriteStream(filePath);
            fileStream.pipe(writeStream);

            const filePromise = new Promise((resolve, reject) => {
                fileStream.on('error', reject);
                writeStream.on('error', reject);
                writeStream.on('finish', () => {
                    console.log(`✅ File saved locally at: ${filePath}`);
                    fileData = {
                        filePath: filePath,
                        filename: file.filename,
                        mimeType: file.mimeType
                    };
                    resolve();
                });
            });
            promises.push(filePromise);
        });

        busboy.on('field', (fieldname, value) => {
            console.log(`-> Busboy 'field' event triggered for field: ${fieldname}`);
            // Note: In this version, we don't need to append fields here
            // We'll create the form after Busboy is finished
        });

        busboy.on('finish', async () => {
            console.log('-> Busboy finish event triggered. Waiting for file uploads to complete.');
            try {
                await Promise.all(promises);
                console.log('All local file writes are complete. Resolving promise.');

                if (!fileData) {
                    return res.status(400).json({ error: 'No file uploaded.' });
                }

                // ✅ Sử dụng API FormData tích hợp sẵn để tạo form mới
                const modernForm = new FormData();
                const fileBlob = await fs.promises.readFile(fileData.filePath);

                modernForm.append('file', new Blob([fileBlob], { type: fileData.mimeType }), fileData.filename);

                // Add other form fields from the original request body
                for (const key in req.body) {
                    modernForm.append(key, req.body[key]);
                }

                console.log('Busboy parsing complete. Preparing to send to PHP backend...');
                const phpResponse = await fetch('http://localhost/api-upload-php/', {
                    method: 'POST',
                    body: modernForm,
                });

                const responseData = await phpResponse.json();
                console.log(`Response received from PHP. Status: ${phpResponse.status}`);
                console.log('PHP Response Data:', responseData);
                res.status(phpResponse.status).json(responseData);

            } catch (error) {
                console.error('An error occurred during file writing or proxying:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        req.pipe(busboy);
    };
}

export { ApiUploadNodeModern };