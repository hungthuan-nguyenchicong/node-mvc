# Bạn có thể tự code JWT để đồng bộ xác thực giữa Node.js, PHP và client mà không cần thư viện

## Phía Client (Vanilla JS)

// Sau khi đăng nhập và nhận được token từ server Node.js
async function handleLogin() {
    const response = await fetch('http://node-server.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password' }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('authToken', data.token);
        console.log('Đăng nhập thành công và token đã được lưu.');
    }
}

// Hàm gửi yêu cầu tới server PHP
async function uploadFile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Không tìm thấy token. Vui lòng đăng nhập.');
        return;
    }

    const fileInput = document.getElementById('myFile');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('http://php-server.com/api/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    const result = await response.json();
    console.log(result.message);
}

## Máy chủ phía (Node.js)

// Server Node.js (tạo token)
const crypto = require('crypto');
const express = require('express');
const app = express();
app.use(express.json());

const secretKey = 'my_super_secret_key'; // Khóa bí mật phải giống hệt nhau trên cả hai server

function base64urlEncode(str) {
    return Buffer.from(str).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

app.post('/login', (req, res) => {
    // Giả sử xác thực thành công
    const userPayload = { userId: 123, username: req.body.username, exp: Math.floor(Date.now() / 1000) + (60 * 60) }; // Thêm thời gian hết hạn

    const header = { "alg": "HS256", "typ": "JWT" };
    const encodedHeader = base64urlEncode(JSON.stringify(header));
    const encodedPayload = base64urlEncode(JSON.stringify(userPayload));

    const signature = crypto.createHmac('sha256', secretKey)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    res.json({ token });
});

app.listen(3000, () => console.log('Node server running on port 3000'));

## Phía Server (PHP)

// Server PHP (xác minh token và xử lý tải lên)
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
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false; // Token đã hết hạn
        }
        return $payload;
    } catch (Exception $e) {
        return false;
    }
}

// Xử lý request tải lên
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = preg_replace('/Bearer\s/', '', $authHeader);
$secretKey = 'my_super_secret_key';

if ($token && ($decodedPayload = verifyJWT($token, $secretKey))) {
    // Token hợp lệ, tiếp tục xử lý tải lên
    echo json_encode(['message' => 'Tải lên thành công, xin chào ' . $decodedPayload['username']]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Xác thực thất bại.']);
}

