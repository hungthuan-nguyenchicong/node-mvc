# Triển khai JWT trên Node.js (với Express)

npm install jsonwebtoken

## Tạo token

const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Luôn giữ bí mật!

// Giả sử user đã được xác thực
const userPayload = { id: user.id, username: user.username };
const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' }); // Token hết hạn sau 1 giờ

res.json({ token: token });

## Xác minh token

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token not provided.' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

// Áp dụng middleware cho route cần bảo vệ
app.get('/api/upload', verifyToken, (req, res) => {
    // ... xử lý logic tải file
});

# Triển khai JWT trên PHP

composer require firebase/php-jwt

## Tạo token
<?php
require __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = 'your-secret-key';
$issuedAt = time();
$expirationTime = $issuedAt + 3600; // Hết hạn sau 1 giờ

$payload = array(
    "nbf" => $issuedAt,
    "exp" => $expirationTime,
    "data" => [
        "id" => $user->id,
        "username" => $user->username
    ]
);

$token = JWT::encode($payload, $secretKey, 'HS256');
echo json_encode(['token' => $token]);

## Xác minh token

<?php
require __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = 'your-secret-key';
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    http_response_code(403);
    die(json_encode(['message' => 'Token not provided.']));
}

try {
    $token = explode(' ', $headers['Authorization'])[1];
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

    // Token hợp lệ, tiếp tục xử lý
    // ... xử lý tải file ...
    echo json_encode(['message' => 'File uploaded successfully.']);
} catch (Exception $e) {
    http_response_code(401);
    die(json_encode(['message' => 'Invalid token.', 'error' => $e->getMessage()]));
}

