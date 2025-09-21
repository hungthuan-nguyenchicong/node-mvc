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
        proxyRes: (proxyRes, req, res) => {
            /* handle proxyRes */
            let body = [];
            // Lắng nghe sự kiện 'data' để nhận các mảnh dữ liệu
            proxyRes.on('data', (chunk) => {
                body.push(chunk);
            });
            // Lắng nghe sự kiện 'end' để biết đã nhận đủ dữ liệu
            proxyRes.on('end', () => {
                // Nối các mảnh dữ liệu lại và chuyển thành chuỗi
                const responseBody = Buffer.concat(body).toString('utf8');
                console.log('Response from PHP:', responseBody);
            });
        },
        error: (err, req, res) => {
            /* handle error */
            console.error('Proxy Error:', err);
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
