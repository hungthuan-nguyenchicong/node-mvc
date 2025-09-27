# PHP có thể đọc được dữ liệu dbResult đã được xử lý bởi Node.js và http-proxy-middleware

## Giả lập ImageController và logic database

import express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

// Giả lập ImageController và logic database
class ImageController {
    async saveImageToDb(imageData) {
        console.log('Đang lưu dữ liệu vào database...');
        console.log(imageData); // Đây là mảng dữ liệu bạn muốn truyền
        // Thêm logic lưu dữ liệu vào database ở đây
        return { message: 'Lưu dữ liệu thành công' };
    }
}

// Middleware để tương tác với database trước khi chuyển tiếp request
const databaseImage = async (req, res, next) => {
    // Chỉ xử lý các request POST
    if (req.method === 'POST') {
        try {
            console.log('Đã nhận được request POST. Đang thực hiện logic database...');
            
            // Log dữ liệu nhận được từ req.body
            console.log('Dữ liệu từ request body:', req.body);
            
            // Kiểm tra xem req.body có phải là một mảng không
            if (Array.isArray(req.body) && req.body.length > 0) {
                console.log('Phát hiện mảng dữ liệu. Đang xử lý...');
                const imageController = new ImageController();
                const dbResult = await imageController.saveImageToDb(req.body);

                // Giả định rằng việc ghi database thành công
                if (dbResult) {
                    console.log('Ghi database thành công. Chuyển tiếp tới proxy.');
                    // Gán dữ liệu database vào req để proxy có thể truy cập nếu cần
                    req.dbResult = dbResult;
                    return next();
                } else {
                    console.log('Ghi database thất bại. Đã dừng request.');
                    return res.status(500).json({ err: 'Failed to write to database' });
                }
            } else {
                console.log('Body request không phải là mảng hoặc rỗng.');
                return res.status(400).json({ err: 'Invalid data format. Expected an array.' });
            }

        } catch (dbError) {
            console.error('Lỗi database:', dbError);
            return res.status(500).json({ err: 'Internal Server Error', details: dbError.message });
        }
    }

    // Nếu không phải là POST, trả về lỗi ngay
    return res.status(405).json({ err: 'Method Not Allowed' });
};


// Cấu hình proxy cho các API
const apiProxy = createProxyMiddleware({
    target: 'http://localhost:8000/api-upload-php/upload-node.php',
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
        // Thêm một hàm để sửa đổi request trước khi gửi đi
        proxyReq: (proxyReq, req, res) => {
            // Lấy dữ liệu từ req.dbResult và thêm vào header
            if (req.dbResult && req.dbResult.message) {
                proxyReq.setHeader('X-DB-Result-Message', req.dbResult.message);
            }
            // Thêm các header khác đã có
            proxyReq.setHeader('X-From-Node', 'true');
        },
        proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            if (proxyRes.headers['content-type'] === 'application/json') {
                let data = JSON.parse(responseBuffer.toString('utf8'));
                // Bạn có thể truy cập dữ liệu đã xử lý từ database ở đây nếu cần
                // Ví dụ: console.log('Kết quả từ database:', req.dbResult);
                
                data = Object.assign({}, data, { extra: 'foo bar' });
                return JSON.stringify(data);
            }
            return responseBuffer;
        }),
    },
});

// Cấu hình proxy cho các tệp tĩnh, ví dụ: hình ảnh
const imageProxy = createProxyMiddleware({
    target: 'http://localhost:8000/uploads',
    changeOrigin: true,
});

class ApiUploadNode {
    constructor(app) {
        // Đặt express.json() trước các middleware khác
        app.use(express.json());
        
        // Bây giờ, req.body sẽ có sẵn khi request tới databaseImage
        app.use('/api-upload-node/', databaseImage, apiProxy);
        
        // Định nghĩa route cho các tệp tĩnh
        app.use('/uploads', imageProxy);
    }
}

// Bắt đầu ứng dụng Express
const app = express();
const PORT = 3000;

// Sử dụng class ApiUploadNode để thiết lập routes
new ApiUploadNode(app);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log('Để kiểm tra, hãy gửi một request POST với body JSON tới http://localhost:3000/api-upload-node/');
});


## php

<?php
// Lấy tất cả các headers của request
$headers = getallheaders();

// Kiểm tra xem header tùy chỉnh có tồn tại không
if (isset($headers['X-DB-Result-Message'])) {
    $dbResultMessage = $headers['X-DB-Result-Message'];
    
    // In ra thông điệp
    echo "Thông điệp từ database (Node.js): " . $dbResultMessage;
} else {
    echo "Không tìm thấy header 'X-DB-Result-Message'.";
}
?>

# Cấu hình Node.js Proxy để truyền Body

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Giả lập ImageController
class ImageController {
    async saveImageToDb(imageData) {
        console.log('Đang lưu dữ liệu vào database...');
        console.log(imageData); 
        return { message: 'Dữ liệu body đã được lưu thành công' };
    }
}

// Middleware để tương tác với database trước khi chuyển tiếp request
const databaseImage = async (req, res, next) => {
    if (req.method === 'POST') {
        try {
            console.log('Đã nhận request POST. Đang xử lý database...');
            const imageController = new ImageController();
            const dbResult = await imageController.saveImageToDb(req.body);

            if (dbResult) {
                console.log('Ghi database thành công. Tiếp tục chuyển tiếp.');
                req.dbResult = dbResult; // Lưu kết quả vào req để sử dụng sau này nếu cần
                return next();
            } else {
                return res.status(500).json({ err: 'Failed to write to database' });
            }
        } catch (dbError) {
            console.error('Lỗi database:', dbError);
            return res.status(500).json({ err: 'Internal Server Error' });
        }
    }
    return res.status(405).json({ err: 'Method Not Allowed' });
};


// Cấu hình proxy cho các API
const apiProxy = createProxyMiddleware({
    target: 'http://localhost/api-upload-php/upload-node.php', // Target PHP server
    changeOrigin: true,
    selfHandleResponse: true,
    
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Kiểm tra xem có body trong request gốc không
            if (req.body) {
                // Chuyển đổi body thành chuỗi JSON
                const bodyData = JSON.stringify(req.body);
                // Cập nhật các header để PHP có thể đọc body JSON
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                // Ghi body vào luồng của request proxy
                proxyReq.write(bodyData);
            }
        },
        proxyRes: (proxyRes, req, res) => {
            // Chuyển tiếp phản hồi từ PHP
            proxyRes.pipe(res);
        },
    },
});

const app = express();
app.use(express.json()); // Middleware để đọc body JSON
app.use('/api-upload-node', databaseImage, apiProxy);

app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});


# php body

<?php
// ... (các header của bạn)
header('Content-Type: application/json');

// Lấy nội dung thô của request body
$json_data = file_get_contents('php://input');

$response = [];

// Kiểm tra xem dữ liệu có rỗng không
if (!empty($json_data)) {
    // Giải mã chuỗi JSON thành một mảng PHP
    $data_array = json_decode($json_data, true);

    // Kiểm tra xem việc giải mã có thành công không
    if ($data_array !== null) {
        $response['status'] = 'success';
        $response['message'] = 'Dữ liệu body đã được nhận và xử lý.';
        $response['receivedData'] = $data_array; // Gửi lại dữ liệu đã nhận để kiểm tra
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Không thể giải mã JSON. Dữ liệu không hợp lệ.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Request body rỗng.';
}

// Trả về JSON chứa kết quả
echo json_encode($response);
?>
