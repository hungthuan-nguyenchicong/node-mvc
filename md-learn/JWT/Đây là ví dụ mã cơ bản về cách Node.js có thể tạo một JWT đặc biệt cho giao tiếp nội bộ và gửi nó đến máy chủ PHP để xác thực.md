# Đây là ví dụ mã cơ bản về cách Node.js có thể tạo một JWT đặc biệt cho giao tiếp nội bộ và gửi nó đến máy chủ PHP để xác thực

## Phía máy chủ Node.js (Người gửi)

// File: server.js
const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch'); // Cần cài đặt: npm install node-fetch

const app = express();
app.use(express.json());

const serverToServerSecret = 'my_internal_super_secret_key_123';
const phpServerUrl = 'http://php-server.com';

function base64urlEncode(str) {
    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createServerJWT(payload, secret) {
    const header = { "alg": "HS256", "typ": "JWT" };
    const encodedHeader = base64urlEncode(JSON.stringify(header));
    const encodedPayload = base64urlEncode(JSON.stringify(payload));
    const signature = crypto.createHmac('sha256', secret).update(`${encodedHeader}.${encodedPayload}`).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

app.post('/api-upload-from-client', async (req, res) => {
    // GIẢ ĐỊNH: Bạn đã xác thực người dùng từ client (ví dụ: qua session hoặc JWT của client)
    const user = { id: 'user123', username: 'john_doe' };

    // Tạo JWT đặc biệt cho giao tiếp giữa các máy chủ
    const internalPayload = {
        userId: user.id,
        source: 'nodejs_server',
        timestamp: Date.now(),
        // Không thêm dữ liệu nhạy cảm
    };
    const internalJwt = createServerJWT(internalPayload, serverToServerSecret);

    // Chuẩn bị và chuyển tiếp tệp đến máy chủ PHP
    try {
        const fileData = req.body.file; // Giả sử tệp được gửi dưới dạng JSON Base64 hoặc tương tự
        const response = await fetch(`${phpServerUrl}/api/internal-upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Gửi JWT đặc biệt trong tiêu đề Authorization
                'Authorization': `Bearer ${internalJwt}`
            },
            body: JSON.stringify({ file: fileData }),
        });

        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to forward request to PHP server.' });
    }
});

app.listen(3000, () => console.log('Node.js server listening on port 3000'));

##  Phía máy chủ PHP (Người nhận)

<?php
// File: /api/internal-upload.php
function base64url_decode($data) {
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
}

function verifyJWT($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    list($encodedHeader, $encodedPayload, $signature) = $parts;
    $expectedSignature = hash_hmac('sha256', "$encodedHeader.$encodedPayload", $secret, true);
    $encodedExpectedSignature = base64url_encode($expectedSignature);

    if ($signature !== $encodedExpectedSignature) return false;

    try {
        $payload = json_decode(base64url_decode($encodedPayload), true);
        return $payload;
    } catch (Exception $e) {
        return false;
    }
}

header('Content-Type: application/json');
$serverToServerSecret = 'my_internal_super_secret_key_123'; // Phải giống hệt khóa trên Node.js

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = preg_replace('/Bearer\s/', '', $authHeader);

if ($token) {
    $decodedPayload = verifyJWT($token, $serverToServerSecret);

    if ($decodedPayload && $decodedPayload['source'] === 'nodejs_server') {
        // Yêu cầu đã được xác thực thành công từ Node.js
        // Bây giờ bạn có thể xử lý tệp
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        
        $userId = $decodedPayload['userId'];
        $fileData = $data['file'];

        // Logic xử lý tệp (ví dụ: lưu vào ổ đĩa)
        // file_put_contents("/path/to/uploads/{$userId}_file.png", base64_decode($fileData));

        echo json_encode(['message' => "Tệp được xử lý bởi PHP. Tải lên bởi người dùng: {$userId}"]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Xác thực không hợp lệ.']);
    }
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Không tìm thấy token.']);
}
?>

