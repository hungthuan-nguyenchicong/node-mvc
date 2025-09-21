import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { ImageController } from '../controllers/ImageController.js';
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
                console.log(data);
                // manipulate JSON data here
                data = Object.assign({}, data, { extra: 'foo bar' });

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

// Middleware để tương tác với database trước khi chuyển tiếp request
const databaseImage = async (req, res, next) => {
    // Chỉ xử lý các request POST
    if (req.method === 'POST') {
        try {
            console.log('Đang thực hiện logic database...');
            // --- Ghi dữ liệu vào database ở đây ---
            // const imageController = new ImageController();
            // await imageController.saveImageToDb(req.body);
            // -------------------------------------

            // Giả định rằng việc ghi database thành công
            const isDbWriteSuccessful = true;

            if (isDbWriteSuccessful) {
                console.log('Ghi database thành công. Chuyển tiếp tới proxy.');
                // Gọi next() để chuyển request tới middleware tiếp theo (apiProxy)
                return next();
            } else {
                // Nếu ghi database thất bại, trả về lỗi ngay lập tức
                console.log('Ghi database thất bại. Đã dừng request.');
                return res.status(500).json({ err: 'Failed to write to database' });
            }
        } catch (dbError) {
            console.error('Lỗi database:', dbError);
            // Bắt lỗi và trả về phản hồi lỗi
            return res.status(500).json({ err: 'Internal Server Error', details: dbError.message });
        }
    }

    // Nếu không phải là POST, chỉ gọi next()
    next();
};


class ApiUploadNode {
    constructor(app) {
        const imageControllerInstance = new ImageController();
        // app.post('/api-upload-node/', (req, res) => {
        //     return res.json({ ok: 'ok' });
        // });
        app.post('/api-upload-node/', imageControllerInstance.insert, apiProxy);
        // Định nghĩa route cho các tệp tĩnh
        app.use('/uploads', imageProxy);
    }
}

export { ApiUploadNode }
