# Chuyển Tiếp Request từ Node.js -> PHP

### 1\. Truyền và Lấy Dữ Liệu từ Client -\> Node.js

Để truyền file từ client lên Node.js và lấy các giá trị của file, bạn cần sử dụng một middleware để xử lý dữ liệu `multipart/form-data`. **Multer** là lựa chọn phổ biến nhất cho việc này.

#### **Cài đặt Multer:**

```bash
npm install multer
```

#### **Sử dụng Multer:**

Bạn sẽ tạo một endpoint để Multer xử lý file. Middleware này sẽ phân tích `FormData` và gắn thông tin file vào `req.file` hoặc `req.files`.

```javascript
// server.js (Ví dụ với Express)
import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' }); // Thư mục tạm để lưu file

app.post('/api-upload-node', upload.single('file'), (req, res) => {
    // Thông tin file đã được lưu trong req.file
    console.log(req.file); // Đây chính là dữ liệu bạn muốn: { fieldname: 'file', originalname: '...', path: '...' }
    
    // Gửi phản hồi hoặc xử lý tiếp
    res.json({ message: 'File received by Node.js' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

Sau khi chạy code trên, bạn sẽ nhận được log chính xác như object bạn đã cung cấp, vì Multer đã xử lý `FormData` và trích xuất thông tin file vào `req.file`.

-----

### 2\. Chuyển Tiếp Request từ Node.js -\> PHP

Để chuyển tiếp request file đã nhận được từ Node.js sang PHP, bạn sẽ cần tạo lại request `multipart/form-data` và gửi nó đi. Dòng code `body: this.req` bạn đã dùng không đúng, vì nó cố gắng gửi toàn bộ đối tượng request. Thay vào đó, bạn phải tạo lại `FormData` mới từ thông tin file đã nhận được.

#### **Sử dụng `form-data`:**

Bạn có thể sử dụng thư viện `form-data` để dễ dàng tạo một `FormData` mới để gửi đi.

```bash
npm install form-data
```

#### **Cách chuyển tiếp:**

```javascript
// backend/core/ApiUploadNode.js
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs"; // Sử dụng để đọc file tạm thời

class ApiUploadNode {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.clientForwardRequest();
    }

    async clientForwardRequest() {
        if (this.req.method === "POST" && this.req.file) {
            const form = new FormData();
            
            // Gắn file đã nhận được từ Multer vào FormData mới
            form.append('file', fs.createReadStream(this.req.file.path), this.req.file.originalname);

            try {
                const response = await fetch('http://localhost/api-upload-node/', {
                    method: "POST",
                    headers: {
                        ...form.getHeaders() // Lấy các headers của FormData
                    },
                    body: form,
                });

                const result = await response.json();
                
                // Xóa file tạm sau khi chuyển tiếp xong
                fs.unlink(this.req.file.path, (err) => {
                    if (err) console.error("Error deleting temp file:", err);
                });

                return this.res.json(result);
            } catch (error) {
                console.error("Error forwarding request:", error);
                return this.res.status(500).json({ error: 'Failed to forward request' });
            }
        }
        return this.res.status(405).json({ err: 405 });
    }
}
```

**Giải thích:**

1.  **`fs.createReadStream()`**: Tạo một luồng đọc từ đường dẫn tệp tạm thời mà Multer đã tạo.
2.  **`form.append()`**: Gắn luồng đọc file vào đối tượng `FormData` mới.
3.  **`...form.getHeaders()`**: Lấy các headers cần thiết (đặc biệt là `Content-Type: multipart/form-data`) từ đối tượng `form` và thêm chúng vào request gửi đi.

-----

Sau khi đã thấy cách xử lý và chuyển tiếp file, bạn có muốn tìm hiểu cách PHP nhận và xử lý file đã được chuyển tiếp từ Node.js không?