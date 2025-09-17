// backend/core/ApiUploadNode.js
import fetch from "node-fetch";
// npm install form-data
import FormData from "form-data";
class ApiUploadNode {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.clientFetchNode();
    }

    async clientFetchNode() {
        if (this.req.method === "POST") {
            // Lấy dữ liệu tệp tin từ req.files
            const fileData = this.req.files.file;

            console.log(this.req);

            // Tạo một đối tượng FormData mới để gửi lại
            const form = new FormData();
            // Thêm tệp tin vào form mới. Lưu ý: form.append(name, data, filename)
            form.append('file', fileData.data, fileData.name);
            console.log(fileData);
            // Get the Content-Type from the original request
            const contentType = this.req.headers['content-type'];
            //form.append('file', this.req.files.file);
            const response = await fetch('http://localhost/api-upload-php/', {
                method: "POST",
                // Quan trọng: Bỏ headers['Content-Type'] vì FormData sẽ tự động tạo header này
                body: form,
                // You may need to manually add headers if FormData doesn't handle them
                //headers: form.getHeaders(),
                headers: {
                    'X-From-Node': 'true',
                    'Content-Type': contentType,
                },
            });

            const result = await response.json();

            // Trả về kết quả từ PHP cho client
            return this.res.json(result);
        }
        return this.res.status(405).json({ err: 405 });
    }
}

export { ApiUploadNode }