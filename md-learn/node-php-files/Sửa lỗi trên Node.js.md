## Sửa lỗi trên Node.js

// Cần import FormData từ 'form-data'
import FormData from "form-data";

async clientFetchNode() {
    if (this.req.method === "POST") {
        // Lấy dữ liệu tệp tin từ req.files
        const fileData = this.req.files.file;

        // Tạo một đối tượng FormData mới để gửi lại
        const form = new FormData();
        // Thêm tệp tin vào form mới. Lưu ý: form.append(name, data, filename)
        form.append('file', fileData.data, fileData.name);

        const response = await fetch('http://localhost/api-upload-php/', {
            method: "POST",
            // Quan trọng: Bỏ headers['Content-Type'] vì FormData sẽ tự động tạo header này
            body: form
        });

        const result = await response.json();
        
        // Trả về kết quả từ PHP cho client
        return this.res.json(result);
    }
    return this.res.status(405).json({ err: 405 });
}