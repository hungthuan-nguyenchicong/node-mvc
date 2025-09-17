## busboy
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

## multer
// Cài đặt: npm install multer
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Tạo một thư mục tạm để Multer lưu tệp.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'temp_uploads');
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

## express-form-data

// Cài đặt: npm install express-form-data
import expressFormData from 'express-form-data';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const options = {
  uploadDir: path.join(__dirname, 'temp_uploads'),
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
      console.log(`Response received from PHP. Status: ${res.status}`);
      console.log('PHP Response Data:', responseData);
      res.status(res.status).json(responseData);
    }).catch(error => {
      console.error('Fetch to PHP failed:', error);
      res.status(500).json({ error: 'Proxying to PHP failed' });
    });
  };
}

// Cách sử dụng: app.post('/api-upload-node/', expressFormData.parse(options), ApiUploadExpressFormData());
export { ApiUploadExpressFormData, expressFormData };