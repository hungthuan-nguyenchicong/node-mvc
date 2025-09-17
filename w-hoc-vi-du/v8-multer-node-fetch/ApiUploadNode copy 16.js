// backend/core/ApiUploadNode.js
// npm i multer
import multer from 'multer';
// npm i node-fetch
import fetch, { FormData } from 'node-fetch';
class ApiUploadNode {
    // constructor() {
    //     const upload = multer({ dest: 'uploads/' });
    //     this.uploadMiddleware = upload.fields([{ name: 'file', maxCount: 1 }]);
    //     // const storage = multer.diskStorage({
    //     // destination: function (req, file, cb) {
    //     //     cb(null, '/tmp/my-uploads')
    //     // },
    //     // filename: function (req, file, cb) {
    //     //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //     //     cb(null, file.fieldname + '-' + uniqueSuffix)
    //     // }
    //     // })

    //     // this.upload = multer({ storage: storage })
    // }

    constructor() {
        // 1. Configure the disk storage
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/'); // The folder where files will be saved
            },
            filename: (req, file, cb) => {
                // Use the original name with a timestamp to prevent overwriting
                cb(null, Date.now() + '-' + file.originalname);
            }
        });

        // 2. Create the multer middleware using the configured storage
        const upload = multer({ storage: storage });
        this.uploadMiddleware = upload.fields([{ name: 'file', maxCount: 1 }]);
    }

    apiUploadPhp() {
        return async (req, res) => {
            //console.log(req.files)
            const hostPhp = 'http://localhost/api-upload-php/';
            const formData = new FormData();
            const uploadedFile = req.files.file[0];

            //formData.set('file', req.files);

            formData.append('file', uploadedFile);
            const response = await fetch(hostPhp, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            console.log(result)
            return res.json({ upload: 'ok' })
        }
    }

}

export { ApiUploadNode }