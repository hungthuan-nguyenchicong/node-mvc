# Gửi Tệp Từ Node.js Sang PHP

## Phía Node.js (Server trung gian):

// Cài đặt thư viện cần thiết
// npm install node-fetch

const http = require('http');
const fetch = require('node-fetch');

const phpServerUrl = 'http://php-server.com/api/upload';

http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/api/upload') {
        // Lấy headers từ yêu cầu gốc của client
        const headers = req.headers;
        headers['host'] = new URL(phpServerUrl).host;

        // Bỏ header 'content-length' để node-fetch tự xử lý
        delete headers['content-length'];

        // Chuyển tiếp luồng (stream) dữ liệu đến máy chủ PHP
        try {
            const phpResponse = await fetch(phpServerUrl, {
                method: 'POST',
                headers: headers,
                body: req, // Truyền trực tiếp luồng yêu cầu
            });

            // Chuyển tiếp phản hồi từ PHP về client
            phpResponse.headers.forEach((value, name) => {
                res.setHeader(name, value);
            });
            res.writeHead(phpResponse.status);
            phpResponse.body.pipe(res);
        } catch (error) {
            console.error('Lỗi khi chuyển tiếp yêu cầu:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Lỗi máy chủ nội bộ.' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}).listen(3000, () => console.log('Node.js server listening on port 3000'));

## Phía PHP (Server đích):

<?php
// /api/upload.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $uploadDir = './uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = basename($_FILES['file']['name']);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            echo json_encode(['message' => 'Tệp được tải lên thành công.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Không thể lưu tệp.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Không có tệp nào được tìm thấy trong yêu cầu.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Phương thức không được phép.']);
}
?>

