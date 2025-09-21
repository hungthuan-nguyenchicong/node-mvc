import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

const apiProxy = createProxyMiddleware({
    target: 'http://localhost/api-upload-php/upload-node.php',
    changeOrigin: true,
    // Thêm header 'X-From-Node' vào request trước khi gửi đi
    /**
   * IMPORTANT: avoid res.end being called automatically
   **/
    selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()

    on: {
        proxyReq: (proxyReq) => {
            /* handle proxyReq */
            proxyReq.setHeader('X-From-Node', 'true');
        },
        proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            // detect json responses
            if (proxyRes.headers['content-type'] === 'application/json') {
                let data = JSON.parse(responseBuffer.toString('utf8'));

                // manipulate JSON data here
                data = Object.assign({}, data, { extra: 'foo bar' });
                console.log(data)
                // return manipulated JSON
                return JSON.stringify(data);
            }

            // return other content-types as-is
            return responseBuffer;
        }),
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
