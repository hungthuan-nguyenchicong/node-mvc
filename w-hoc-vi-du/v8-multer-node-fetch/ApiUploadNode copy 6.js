// ApiUploadNode.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import multer from 'multer';
function ApiUploadNode() {
    return createProxyMiddleware({
        target: 'http://localhost/api-upload-php/',
        changeOrigin: true,
        // Lắng nghe các sự kiện lỗi từ proxy
        // Sử dụng onProxyReq để xử lý luồng dữ liệu
        onProxyReq: (proxyReq, req, res) => {
            console.log(req)
            if (req.files) {
                // Ghi lại dữ liệu đã được xử lý (nếu có) vào luồng proxyReq
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err.message);
            // Trả về một phản hồi JSON
            if (!res.headersSent) {
                res.status(500).json({ error: 'Proxy encountered an error.' });
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            // Lắng nghe các lỗi từ luồng phản hồi của PHP
            proxyRes.on('error', (err) => {
                console.error('PHP response stream error:', err.message);
            });
        },
    });
}

export { ApiUploadNode };