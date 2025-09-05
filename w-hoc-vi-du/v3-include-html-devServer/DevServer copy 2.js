// backend/untils/DevServer.js
// npm i node-fetch -D
import fetch from 'node-fetch'; // Không cần dùng nữa
// npm i express-http-proxy -D
import proxy from 'express-http-proxy';

class DevServer {
    constructor(app) {
        this.vite = 'http://localhost:5173/';
        // Cấu hình proxy ngay trong constructor để nó được khởi tạo một lần
        this.devRoute(app);
    }

    devRoute(app) {
        // Sử dụng proxy middleware cho tất cả các yêu cầu bắt đầu bằng '/dev'
        app.use('/dev', proxy(this.vite, {
            // Tùy chọn `proxyReqPathResolver` để loại bỏ '/dev' khỏi đường dẫn
            // trước khi gửi đến Vite.
            proxyReqPathResolver: (req) => {
                const path = req.url.replace(/^\/dev/, '');
                return path || '/';
            }
        }));
    }
}

export { DevServer };