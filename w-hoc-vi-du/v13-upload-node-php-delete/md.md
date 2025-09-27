# insert
## client
const response = await fetch('/api-upload-node/', {
            //const response = await fetch('http://localhost/api-upload-php/', {

            method: 'POST',
            headers: {
                // Thêm header tùy chỉnh với tên file
                'X-File-Name': file.name
            },
            body: formData
        });
## image Controller
// backend/controllers/ImageController.js
import { ImageModel } from "../models/ImageModel.js";
class ImageController {
    constructor() {
        this.insert = this.insert.bind(this);
        this.delete = this.delete.bind(this);
        this.imageModelInstance = new ImageModel();
    }

    async insert(req, res, next) {
        //console.log(req.headers)
        // Chỉ xử lý các request POST
        if (req.method === 'POST') {
            try {
                const imageName = req.get('x-file-name');
                const imageSrc = '/uploads/' + imageName;
                const imageInsertId = await this.imageModelInstance.insert_image(imageSrc);
                //console.log(imageInsertId);
                if (imageInsertId) {
                    req.imageInsertId = imageInsertId;
                }
                return next();
            } catch (err) {
                console.error('Lỗi database:', err);
                if (err.errno === 1062) {
                    return res.status(201).json({ err: 'File đã tồn tại vui lòng đổi tên file hoặc chọn file khác' });
                }
                // Bắt lỗi và trả về phản hồi lỗi
                return res.status(500).json({ err: 500 });
            }
        }

        // Nếu không phải là POST, chỉ gọi next() và trả về JSON cho client
        //next();

        // Nếu không phải là POST, chỉ gọi next()
        return res.status(405).json({ err: 405 });
    }

    async delete(req, res) {
        if (req.method === 'DELETE') {
            const imageId = req.query.imageId;
            if (imageId) {
                //console.log(imageId);
                try {
                    await this.imageModelInstance.delete_image(imageId);
                    return res.status(201).json({ delete: 'ok' })
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({ err: err });
                }
            }
            return res.status(500).json({ err: 500 });
        }
        return res.status(405).json({ err: 405 });
    }
}

export { ImageController }

## image node

const apiProxy = createProxyMiddleware({
    target: 'http://localhost/api-upload-php/upload-node.php',
    changeOrigin: true,
    // Thêm header 'X-From-Node' vào request trước khi gửi đi
    /**
   * IMPORTANT: avoid res.end being called automatically
   **/
    selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()

    on: {
        proxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-From-Node', 'true');
            proxyReq.setHeader('X-Image-Insert-Id', req.imageInsertId);
        },
        proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            if (proxyRes.headers['content-type'] === 'application/json') {
                let data = JSON.parse(responseBuffer.toString('utf8'));
                return JSON.stringify(data);
            }

            return responseBuffer;
        }),
    },
});
## image php
<?php
// sudo tail -f /usr/local/lsws/logs/error.log
header('Content-Type: application/json');
$headers = getallheaders();
// error_log(var_export($headers, true));
$response = [];
if ($headers['X-Image-Insert-Id']) {
    // 1. Kiểm tra xem file có được tải lên không và không có lỗi
    if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        // Lấy thông tin về file
        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = basename($_FILES['file']['name']);
        // thư mục lưu trữ file
        $uploadDir = __DIR__ . './../uploads/';
        // Đường dẫn đầy dủ cho file đích
        $destPath = $uploadDir . $fileName;
        // Đường dẫn image src
        $imageSrc = '/uploads/' . $fileName;
        // Di chuyển từ thư mục tạm đến thư mục đích
        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $response['status'] = 'success';
            $response['image_src'] = $imageSrc;
        } else {
            $response['status'] = 'error-upload-php';
            $response['image_insert_id'] = $headers['X-Image-Insert-Id'];
            $response['message'] = 'Không thể di chuyển file.';
        }

    } else {
        $response['status'] = 400;
    }
} else {
    $response['status'] = 500;
}
// tra ket qua ve json
echo json_encode($response);
?>




