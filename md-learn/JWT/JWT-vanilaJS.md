# JWT vanilaJS

## Tạo Token (Phía máy chủ - Node.js)

// Server-side (Node.js)
const crypto = require('crypto');

function base64urlEncode(str) {
    return Buffer.from(str).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function createJWT(payload, secret) {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };
    
    const encodedHeader = base64urlEncode(JSON.stringify(header));
    const encodedPayload = base64urlEncode(JSON.stringify(payload));
    
    const signature = crypto.createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Ví dụ sử dụng:
const userPayload = { userId: 123, username: 'testuser' };
const secretKey = 'my_super_secret_key';

const token = createJWT(userPayload, secretKey);
console.log('Generated JWT:', token);

## Xác minh Token (Server-side - Node.js)

// Server-side (Node.js)
const crypto = require('crypto');

function base64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return Buffer.from(str, 'base64').toString('utf-8');
}

function verifyJWT(token, secret) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return false;
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    if (signature !== expectedSignature) {
        return false;
    }

    try {
        const payload = JSON.parse(base64urlDecode(encodedPayload));
        // Kiểm tra thời gian hết hạn nếu có
        return payload;
    } catch (e) {
        return false;
    }
}

// Ví dụ sử dụng:
const receivedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJ0ZXN0dXNlciJ9.tT7jP-1_J3cT_5P5q8n6G_vF9_8m-2V-2O_jO-1w9f0'; // Giả sử token này được tạo từ bước 1
const secretKey = 'my_super_secret_key';

const decodedPayload = verifyJWT(receivedToken, secretKey);
if (decodedPayload) {
    console.log('Token is valid. Payload:', decodedPayload);
} else {
    console.log('Token is invalid.');
}

## Tạo Token (Server-side - PHP)

<?php
function base64url_encode($data) {
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
}

function createJWT($payload, $secret) {
    $header = [
        "alg" => "HS256",
        "typ" => "JWT"
    ];

    $encodedHeader = base64url_encode(json_encode($header));
    $encodedPayload = base64url_encode(json_encode($payload));

    $signature = hash_hmac('sha256', "$encodedHeader.$encodedPayload", $secret, true);
    $encodedSignature = base64url_encode($signature);

    return "$encodedHeader.$encodedPayload.$encodedSignature";
}

// Ví dụ sử dụng:
$userPayload = ['userId' => 123, 'username' => 'testuser'];
$secretKey = 'my_super_secret_key';

$token = createJWT($userPayload, $secretKey);
echo "Generated JWT: " . $token . "\n";
?>

## Xác minh Token (Server-side - PHP)

<?php
function base64url_decode($data) {
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
}

function verifyJWT($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }

    list($encodedHeader, $encodedPayload, $signature) = $parts;

    $expectedSignature = hash_hmac('sha256', "$encodedHeader.$encodedPayload", $secret, true);
    $encodedExpectedSignature = base64url_encode($expectedSignature);

    if ($signature !== $encodedExpectedSignature) {
        return false;
    }

    try {
        $payload = json_decode(base64url_decode($encodedPayload), true);
        // Kiểm tra thời gian hết hạn nếu có
        return $payload;
    } catch (Exception $e) {
        return false;
    }
}

// Ví dụ sử dụng:
$receivedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJ0ZXN0dXNlciJ9.tT7jP-1_J3cT_5P5q8n6G_vF9_8m-2V-2O_jO-1w9f0';
$secretKey = 'my_super_secret_key';

$decodedPayload = verifyJWT($receivedToken, $secretKey);
if ($decodedPayload) {
    echo "Token is valid. Payload: " . print_r($decodedPayload, true) . "\n";
} else {
    echo "Token is invalid.\n";
}
?>

