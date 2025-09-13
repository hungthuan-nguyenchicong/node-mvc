# Đây là một cách tiếp cận rất hợp lý và an toàn

## Phía Client (Vanilla JS)

// Giả định: Người dùng đã đăng nhập và có cookie session
// trình duyệt sẽ tự động gửi cookie session lên cùng yêu cầu
const uploadFile = async () => {
  const fileInput = document.getElementById('myFile');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('http://node-server.com/api/upload', {
      method: 'POST',
      body: formData, // Trình duyệt tự động đặt Content-Type: multipart/form-data
    });
    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Lỗi khi tải lên:', error);
  }
};

## Phía máy chủ Node.js (Trung gian)
// Cài đặt: npm install express express-session jsonwebtoken node-fetch
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const app = express();

// Cấu hình Session (ví dụ)
app.use(session({
  secret: 'my_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Đặt là true trong môi trường production
}));

// Khóa bí mật cho JWT nội bộ
const internalJwtSecret = 'my_internal_jwt_secret_123';
const phpServerUrl = 'http://php-server.com';

// Middleware xác thực (giả định)
const authenticateSession = (req, res, next) => {
  // Giả định: Bạn đã có logic để xác thực session
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

app.post('/api/upload', authenticateSession, async (req, res) => {
  try {
    // Tạo JWT nội bộ sau khi xác thực session thành công
    const internalToken = jwt.sign(
      { userId: req.session.userId, username: req.session.username },
      internalJwtSecret,
      { expiresIn: '5m' }
    );

    const phpResponse = await fetch(`${phpServerUrl}/api/upload-receiver`, {
      method: 'POST',
      headers: {
        // Gửi JWT nội bộ để PHP xác thực
        'Authorization': `Bearer ${internalToken}`,
      },
      // Chuyển tiếp luồng FormData thô
      body: req,
    });

    const result = await phpResponse.json();
    res.status(phpResponse.status).json(result);
  } catch (error) {
    console.error('Lỗi khi chuyển tiếp:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
});

app.listen(3000, () => console.log('Node.js server listening on port 3000'));

## Phía máy chủ PHP (Đích)

<?php
// Cài đặt: composer require firebase/php-jwt
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

$internalJwtSecret = 'my_internal_jwt_secret_123';

// Lấy token từ header Authorization
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = preg_replace('/Bearer\s/', '', $authHeader);

try {
  $decoded = JWT::decode($token, new Key($internalJwtSecret, 'HS256'));

  // Nếu JWT hợp lệ, tiếp tục xử lý tệp
  if (isset($_FILES['file'])) {
    $uploadDir = './uploads/';
    $fileName = basename($_FILES['file']['name']);
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
      echo json_encode(['message' => 'Tải lên thành công!']);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Không thể lưu tệp.']);
    }
  } else {
    http_response_code(400);
    echo json_encode(['error' => 'Không có tệp nào được tìm thấy.']);
  }

} catch (Exception $e) {
  http_response_code(401);
  echo json_encode(['error' => 'Xác thực thất bại.']);
}
?>

