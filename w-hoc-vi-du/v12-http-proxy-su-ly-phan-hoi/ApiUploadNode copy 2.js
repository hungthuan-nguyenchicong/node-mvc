import { createProxyMiddleware } from 'http-proxy-middleware';

const apiProxy = createProxyMiddleware({
    target: 'http://localhost/api-upload-php/upload-node.php',
    changeOrigin: true,
    // Thêm header 'X-From-Node' vào request trước khi gửi đi
    on: {
        proxyReq: (proxyReq) => {
            /* handle proxyReq */
            proxyReq.setHeader('X-From-Node', 'true');
        },
    },
});

// Cấu hình proxy cho các tệp tĩnh, ví dụ: hình ảnh
const imageProxy = createProxyMiddleware({
    target: 'http://localhost/uploads',
    changeOrigin: true,
    // pathRewrite: {
    //     '^/uploads': '/',
    // },
});

class ApiUploadNode {
    constructor(app) {
        // app.post('/api-upload-node/', (req, res) => {
        //     return res.json({ ok: 'ok' });
        // });
        app.post('/api-upload-node/', apiProxy);
        // Định nghĩa route cho các tệp tĩnh
        app.use('/uploads', imageProxy);
    }
}

export { ApiUploadNode }
