import { createProxyMiddleware } from 'http-proxy-middleware';

const apiProxy = createProxyMiddleware({
    target: 'http://localhost/api-upload-php/index.php',
    changeOrigin: true,
    // Thêm header 'X-From-Node' vào request trước khi gửi đi
    onProxyReq: (proxyReq, req, res) => {
        // Sử dụng setHeader để thêm hoặc thay đổi một header
        // Thêm header để xác thực từ phía backend PHP
        proxyReq.setHeader('X-From-Node', 'true');

        // Đối với các request có body (như file upload với multipart/form-data),
        // cần chuyển tiếp stream của request ban đầu vào request proxy.
        // Htt-proxy-middleware sẽ không tự động làm điều này nếu onProxyReq được định nghĩa.
        req.pipe(proxyReq);
    }
});
class ApiUploadNode {
    constructor(app) {
        // app.post('/api-upload-node/', (req, res) => {
        //     return res.json({ ok: 'ok' });
        // });
        app.post('/api-upload-node/', apiProxy);
    }
}

export { ApiUploadNode }
