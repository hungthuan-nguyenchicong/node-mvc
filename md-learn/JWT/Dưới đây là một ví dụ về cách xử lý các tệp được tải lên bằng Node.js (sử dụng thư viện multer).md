## Dưới đây là một ví dụ về cách xử lý các tệp được tải lên bằng Node.js (sử dụng thư viện multer)

npm install express multer node-fetch

## Tệp: server.js

const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Thư mục tạm thời để lưu tệp

const serverToServerSecret = 'my_internal_super_secret_key_123';
const phpServerUrl = 'http://php-server.com';

function createServerJWT(payload, secret) {
    const header = { "alg": "HS256", "typ": "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(`${encodedHeader}.${encodedPayload}`).digest('base64url');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        // GIẢ ĐỊNH: Bạn đã xác thực người dùng
        const user = { id: 'user456', username: 'jane_doe' };

        // Tạo JWT cho giao tiếp nội bộ
        const internalPayload = { userId: user.id, username: user.username, timestamp: Date.now() };
        const internalJwt = createServerJWT(internalPayload, serverToServerSecret);

        // Đọc tệp đã tải lên và chuyển đổi sang base64 để gửi
        const fileContent = fs.readFileSync(req.file.path);
        const fileBase64 = fileContent.toString('base64');
        const fileName = req.file.originalname;
        const fileMimetype = req.file.mimetype;

        // Xóa tệp tạm thời sau khi đọc
        fs.unlinkSync(req.file.path);

        // Gửi yêu cầu đến máy chủ PHP
        const response = await fetch(`${phpServerUrl}/api/internal-upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${internalJwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: fileName,
                fileMimetype: fileMimetype,
                fileContent: fileBase64
            })
        });

        const result = await response.json();
        res.status(response.status).json(result);

    } catch (error) {
        console.error('Error handling upload:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(3000, () => console.log('Node.js server listening on port 3000'));

## Xử lý trên PHP

<?php
header('Content-Type: application/json');

function base64url_decode($data) {
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
}

function verifyJWT($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    list($encodedHeader, $encodedPayload, $signature) = $parts;
    $expectedSignature = hash_hmac('sha256', "$encodedHeader.$encodedPayload", $secret, true);
    $encodedExpectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));

    if ($signature !== $encodedExpectedSignature) return false;

    try {
        return json_decode(base64url_decode($encodedPayload), true);
    } catch (Exception $e) {
        return false;
    }
}

$serverToServerSecret = 'my_internal_super_secret_key_123';
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = preg_replace('/Bearer\s/', '', $authHeader);

if ($token && ($decodedPayload = verifyJWT($token, $serverToServerSecret))) {
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);

    if (isset($data['fileName']) && isset($data['fileContent']) && isset($data['fileMimetype'])) {
        $userId = $decodedPayload['userId'];
        $fileName = $data['fileName'];
        $fileContent = base64_decode($data['fileContent']);
        $fileMimetype = $data['fileMimetype'];

        $uploadDir = './uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $filePath = $uploadDir . $userId . '_' . basename($fileName);

        if (file_put_contents($filePath, $fileContent)) {
            echo json_encode(['message' => "Tệp {$fileName} được xử lý bởi PHP. Tải lên bởi người dùng: {$userId}"]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save file.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Missing file data in request.']);
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access.']);
}
?>

