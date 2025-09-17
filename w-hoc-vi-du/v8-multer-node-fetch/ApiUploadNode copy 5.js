// ApiUploadNode.js
import { createProxyMiddleware } from 'http-proxy-middleware';

function ApiUploadNode() {
    return createProxyMiddleware({
        target: 'http://localhost/api-upload-php/',
        changeOrigin: true,
        // Quan trọng: Sử dụng `onProxyReq` để kiểm soát dữ liệu
        onProxyReq: (proxyReq, req, res) => {
            // Bắt buộc: Đặt lại `Content-Type` để đảm bảo định dạng `multipart/form-data`
            // được xử lý đúng ở phía PHP.
            const contentType = req.headers['content-type'];
            proxyReq.setHeader('Content-Type', contentType);

            // Quan trọng: Ghi body đã được xử lý bởi `express-fileupload` vào proxy request
            // Điều này giúp chuyển tiếp toàn bộ dữ liệu file.
            if (req.body) {
                proxyReq.write(req.body);
            }
        },
        onError: (err, req, res) => {
            console.error("Proxy error:", err);
            res.status(500).json({ error: 'Proxy forwarding failed.' });
        }
    });
}

export { ApiUploadNode };