# Server Node.js (Sử dụng Express và Multer)

import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch'; // hoặc axios

const app = express();
const port = 3000;

// Cấu hình Multer để lưu trữ tệp vào thư mục 'uploads'
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Phục vụ file HTML tĩnh

// Route xử lý FormData từ client
app.post('/upload', upload.single('uploaded-file'), async (req, res) => {
  // `req.file` chứa thông tin tệp tin đã tải lên
  // `req.body` chứa các trường văn bản khác
  console.log('File đã nhận:', req.file);
  console.log('Dữ liệu form:', req.body);

  // Tạo FormData để gửi đến server PHP
  const phpFormData = new FormData();
  
  // Đính kèm các trường văn bản từ req.body
  for (const key in req.body) {
    phpFormData.append(key, req.body[key]);
  }

  // Đính kèm tệp tin đã tải lên.
  // Quan trọng: Sử dụng `fs.createReadStream` để tạo stream của tệp tin.
  // Thư viện `form-data` hoặc `node-fetch` có thể xử lý điều này.
  // Trong trường hợp này, `node-fetch` có thể trực tiếp gửi `file.path`.
  phpFormData.append('uploaded-file', req.file.path);

  try {
    // Gửi yêu cầu POST đến server PHP
    const phpResponse = await fetch('http://localhost:8000/handle_upload.php', {
      method: 'POST',
      body: phpFormData,
    });

    const phpResult = await phpResponse.json();
    res.json({ 
      message: 'Đã gửi thành công đến PHP!', 
      phpResponse: phpResult 
    });
  } catch (error) {
    console.error('Lỗi khi gửi đến PHP:', error);
    res.status(500).json({ error: 'Lỗi khi xử lý yêu cầu.' });
  }
});

app.listen(port, () => {
  console.log(`Server Node.js đang chạy tại http://localhost:${port}`);
});

## note

Rất sẵn lòng. Dưới đây là một ví dụ đầy đủ về cách Node.js (sử dụng Express và Multer) có thể nhận một `formData` từ client, xử lý nó, và sau đó chuyển tiếp dữ liệu bao gồm cả tệp tin đến một server PHP.

-----

### Bước 1: Server Node.js (Sử dụng Express và Multer)

File: `server.js`

Server Node.js sẽ đóng vai trò là một "cầu nối" trung gian. Nó sẽ nhận yêu cầu từ client, xử lý tệp tin và các trường dữ liệu, sau đó sử dụng thư viện `node-fetch` hoặc `axios` để gửi lại yêu cầu mới tới server PHP.

```javascript
import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch'; // hoặc axios

const app = express();
const port = 3000;

// Cấu hình Multer để lưu trữ tệp vào thư mục 'uploads'
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Phục vụ file HTML tĩnh

// Route xử lý FormData từ client
app.post('/upload', upload.single('uploaded-file'), async (req, res) => {
  // `req.file` chứa thông tin tệp tin đã tải lên
  // `req.body` chứa các trường văn bản khác
  console.log('File đã nhận:', req.file);
  console.log('Dữ liệu form:', req.body);

  // Tạo FormData để gửi đến server PHP
  const phpFormData = new FormData();
  
  // Đính kèm các trường văn bản từ req.body
  for (const key in req.body) {
    phpFormData.append(key, req.body[key]);
  }

  // Đính kèm tệp tin đã tải lên.
  // Quan trọng: Sử dụng `fs.createReadStream` để tạo stream của tệp tin.
  // Thư viện `form-data` hoặc `node-fetch` có thể xử lý điều này.
  // Trong trường hợp này, `node-fetch` có thể trực tiếp gửi `file.path`.
  phpFormData.append('uploaded-file', req.file.path);

  try {
    // Gửi yêu cầu POST đến server PHP
    const phpResponse = await fetch('http://localhost:8000/handle_upload.php', {
      method: 'POST',
      body: phpFormData,
    });

    const phpResult = await phpResponse.json();
    res.json({ 
      message: 'Đã gửi thành công đến PHP!', 
      phpResponse: phpResult 
    });
  } catch (error) {
    console.error('Lỗi khi gửi đến PHP:', error);
    res.status(500).json({ error: 'Lỗi khi xử lý yêu cầu.' });
  }
});

app.listen(port, () => {
  console.log(`Server Node.js đang chạy tại http://localhost:${port}`);
});
```

-----

### Bước 2: Server PHP

File: `handle_upload.php`

Server PHP sẽ nhận `multipart/form-data` như bình thường. Tệp tin đã được Node.js chuyển tiếp sẽ xuất hiện trong biến siêu toàn cục `$_FILES`.

```php
<?php
header('Content-Type: application/json');

$response = [
    'status' => 'success',
    'message' => 'Dữ liệu đã được nhận thành công!',
    'received_data' => $_POST,
    'file_info' => []
];

// Kiểm tra xem có tệp tin được tải lên không
if (isset($_FILES['uploaded-file'])) {
    $file = $_FILES['uploaded-file'];
    
    // Xử lý tệp tin (ví dụ: di chuyển đến một thư mục đích)
    $uploadDir = './uploads/';
    $uploadFile = $uploadDir . basename($file['name']);

    if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
        $response['file_info'] = [
            'name' => $file['name'],
            'type' => $file['type'],
            'size' => $file['size'],
            'upload_path' => $uploadFile
        ];
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Lỗi khi di chuyển tệp tin.';
    }
}

echo json_encode($response);
?>
```

-----

### Bước 3: HTML Client

File: `public/index.html`

Đây là trang web tĩnh sẽ gửi `formData` đến server Node.js.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Upload File</title>
</head>
<body>
    <h2>Upload Tệp tin với FormData</h2>
    <form id="uploadForm">
        <label for="username">Tên người dùng:</label>
        <input type="text" id="username" name="username"><br><br>
        
        <label for="uploaded-file">Chọn Tệp tin:</label>
        <input type="file" id="uploaded-file" name="uploaded-file"><br><br>
        
        <button type="submit">Gửi</button>
    </form>
    <div id="status"></div>

    <script>
        const form = document.getElementById('uploadForm');
        const statusDiv = document.getElementById('status');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            
            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                const result = await response.json();
                statusDiv.innerText = JSON.stringify(result, null, 2);
            } catch (error) {
                statusDiv.innerText = `Lỗi: ${error.message}`;
            }
        });
    </script>
</body>
</html>
```

Ví dụ này cho thấy một quy trình hoàn chỉnh: Client gửi `formData` tới Node.js, Node.js xử lý yêu cầu bằng Multer và sau đó chuyển tiếp dữ liệu đã xử lý tới server PHP bằng `node-fetch`. PHP nhận và xử lý dữ liệu như một yêu cầu POST thông thường.

-----

Bạn có muốn xem một ví dụ tương tự sử dụng thư viện `axios` ở phía Node.js thay vì `node-fetch` không?