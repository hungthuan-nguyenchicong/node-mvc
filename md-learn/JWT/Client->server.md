# với thư viện

## Phía Client (Vanilla JavaScript)

// Giả sử đây là hàm xử lý form đăng nhập
async function handleLoginForm(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        // Lưu token vào localStorage sau khi đăng nhập thành công
        localStorage.setItem('authToken', data.token);
        console.log('Đăng nhập thành công và token đã được lưu.');
    } else {
        console.error('Đăng nhập thất bại:', data.message);
    }
}

// Giả sử đây là hàm gửi yêu cầu tới API cần xác thực (ví dụ: API tải ảnh)
async function uploadImage() {
    const token = localStorage.getItem('authToken'); // Lấy token từ localStorage

    if (!token) {
        console.error('Không có token. Vui lòng đăng nhập.');
        return;
    }
    
    // Tạo FormData cho file
    const formData = new FormData();
    const fileInput = document.getElementById('image-file');
    formData.append('image', fileInput.files[0]);

    const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            // Thêm Authorization header với token
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    const data = await response.json();
    console.log(data.message);
}

## Phía Server (Node.js với Express)

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken'); // Sử dụng thư viện jsonwebtoken cho đơn giản

const secretKey = 'my_super_secret_key'; // Khóa bí mật phải giống nhau

// Middleware để xác minh token
function authenticateToken(req, res, next) {
    // Lấy Authorization header
    const authHeader = req.headers['authorization'];
    // Phân tách "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send('Access Token required!');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Token!');
        }
        // Thêm thông tin người dùng vào request để các middleware/route khác có thể sử dụng
        req.user = user;
        next();
    });
}

// Áp dụng middleware cho route cần bảo vệ
app.post('/api/upload', authenticateToken, (req, res) => {
    // Nếu đến được đây, token đã hợp lệ
    // req.user chứa payload từ token, ví dụ: { userId: 123, username: 'testuser' }
    // Xử lý logic tải file tại đây
    res.status(200).json({ message: `File uploaded successfully by user: ${req.user.username}` });
});

app.listen(3000, () => console.log('Server is running on port 3000'));

# Cách JWT Xác Thực Lượt Tải Lên

## Đăng nhập tại Node.js:

// Server Node.js (sau khi người dùng đăng nhập thành công)
const jwt = require('jsonwebtoken');
const secretKey = 'my_super_secret_key';
const userPayload = { userId: user.id, username: user.username };

// Token có thời gian hết hạn
const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });

// Gửi token về cho client
res.json({ token });

## Tải lên tại PHP:

// Server PHP (tại /api-upload/)
// Lấy token từ header
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = preg_replace('/Bearer\s/', '', $authHeader);

if (!empty($token)) {
    // Sử dụng cùng khóa bí mật đã dùng trên Node.js
    $secretKey = 'my_super_secret_key';
    
    // Hàm verifyJWT sẽ trả về payload nếu token hợp lệ
    $decodedPayload = verifyJWT($token, $secretKey);

    if ($decodedPayload) {
        // Token hợp lệ, bạn có thể truy cập thông tin người dùng từ payload
        // Ví dụ: $userId = $decodedPayload['userId'];
        // Tiếp tục xử lý tải lên
        echo json_encode(['status' => 'success', 'message' => 'Upload successful.']);
    } else {
        // Token không hợp lệ
        http_response_code(401); // Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'Invalid token.']);
    }
} else {
    // Không có token được gửi lên
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token not provided.']);
}

