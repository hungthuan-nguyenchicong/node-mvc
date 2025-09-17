import Busboy from 'busboy';
import fetch from 'node-fetch';
import FormData from 'form-data';

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

        const parsePromise = new Promise((resolve, reject) => {
            busboy.on('file', (fieldname, fileStream, file) => {
                console.log(`-> Busboy 'file' event triggered for field: ${fieldname}`);
                console.log(`   - File Name: ${file.filename}`);
                console.log(`   - MIME Type: ${file.mimeType}`);
                form.append(fieldname, fileStream, {
                    filename: file.filename,
                    contentType: file.mimeType,
                });
            });

            busboy.on('field', (fieldname, value) => {
                console.log(`-> Busboy 'field' event triggered for field: ${fieldname}`);
                console.log(`   - Field Value: ${value}`);
                form.append(fieldname, value);
            });

            busboy.on('finish', () => {
                console.log('-> Busboy ' + 'finish' + ' event triggered. All parts processed.');
                resolve(form);
            });

            busboy.on('error', (err) => {
                console.log('-> Busboy ' + 'error' + ' event triggered.');
                console.error('Busboy parsing error:', err);
                reject(err);
            });

            console.log('Piping request to Busboy for parsing...');
            req.pipe(busboy);
        });

        parsePromise
            .then(async (parsedForm) => {
                console.log('Busboy parsing complete. Preparing to send to PHP backend...');
                console.log('Backend URL:', 'http://localhost/api-upload-php/');
                try {
                    const phpResponse = await fetch('http://localhost/api-upload-php/', {
                        method: 'POST',
                        body: parsedForm,
                        headers: parsedForm.getHeaders(),
                    });

                    // New: Try to read response as text first if json() fails
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