# Tương Tác Dữ Liệu TrongapiProxy

Có, ngoài việc chuyển tiếp (proxy) yêu cầu và phản hồi, `http-proxy-middleware` hoàn toàn có khả năng **tương tác và sửa đổi dữ liệu** từ cả yêu cầu (request) của client và phản hồi (response) từ server PHP.

Điều này được thực hiện thông qua các sự kiện (event) có sẵn trong cấu hình proxy. Hai sự kiện quan trọng nhất cho việc này là:

  * **`onProxyReq`**: Được kích hoạt trước khi proxy gửi yêu cầu đến server PHP. Tại đây, bạn có thể chỉnh sửa các header, hoặc thậm chí là thân của yêu cầu (request body).
  * **`onProxyRes`**: Được kích hoạt khi proxy nhận được phản hồi từ server PHP. Đây chính là nơi bạn có thể đọc, sửa đổi và thậm chí thay thế toàn bộ phản hồi trước khi gửi nó về client.

-----

### Ví dụ: Tương Tác Dữ Liệu Trong `apiProxy`

Dưới đây là một ví dụ minh họa cách bạn có thể sử dụng `onProxyRes` để đọc phản hồi JSON từ PHP, thêm một trường dữ liệu mới vào đó, và sau đó gửi lại cho client.

```javascript
import { createProxyMiddleware } from 'http-proxy-middleware';

const apiProxy = createProxyMiddleware({
    target: 'http://localhost/api-upload-php',
    changeOrigin: true,
    // Cấu hình để Node.js lắng nghe phản hồi từ PHP
    on: {
        proxyReq: (proxyReq) => {
            // Thêm header vào yêu cầu gửi đến PHP (đã có trong code của bạn)
            proxyReq.setHeader('X-From-Node', 'true');
        },
        proxyRes: (proxyRes, req, res) => {
            // Khai báo một mảng để lưu trữ dữ liệu phản hồi
            const bodyChunks = [];
            
            // Lắng nghe sự kiện 'data' để nhận các "mảnh" dữ liệu từ phản hồi
            proxyRes.on('data', (chunk) => {
                bodyChunks.push(chunk);
            });
            
            // Lắng nghe sự kiện 'end' để biết đã nhận đủ dữ liệu
            proxyRes.on('end', () => {
                const body = Buffer.concat(bodyChunks);
                const originalJson = body.toString('utf8');
                
                try {
                    const data = JSON.parse(originalJson);
                    
                    // Thêm dữ liệu mới vào đối tượng JSON
                    data.proxiedBy = 'Node.js'; 
                    
                    // Chuyển đổi lại thành chuỗi JSON
                    const modifiedJson = JSON.stringify(data);
                    
                    // Ghi lại phản hồi đã được sửa đổi cho client
                    res.setHeader('Content-Length', Buffer.byteLength(modifiedJson));
                    res.end(modifiedJson);
                    
                } catch (e) {
                    // Xử lý lỗi nếu phản hồi không phải là JSON hợp lệ
                    console.error("Failed to parse JSON from PHP:", e);
                    res.end(originalJson);
                }
            });
        },
    },
});

class ApiUploadNode {
    constructor(app) {
        app.post('/api-upload-node/', apiProxy);
    }
}

export { ApiUploadNode }
```

### Giải Thích

  * **Lắng nghe sự kiện `proxyRes`**: Khi PHP gửi phản hồi về, sự kiện này được kích hoạt.
  * **Thu thập dữ liệu theo luồng (stream)**: Phản hồi từ server là một luồng (stream), vì vậy chúng ta không thể đọc toàn bộ dữ liệu cùng một lúc. Chúng ta phải lắng nghe sự kiện `data` để thu thập từng "mảnh" dữ liệu (chunk) vào một mảng.
  * **Chờ `end` và xử lý**: Khi sự kiện `end` xảy ra, nghĩa là toàn bộ phản hồi đã được nhận. Ta nối các "mảnh" dữ liệu lại, chuyển đổi sang chuỗi JSON và phân tích nó bằng `JSON.parse()`.
  * **Sửa đổi và gửi lại**: Sau khi có đối tượng JavaScript, bạn có thể tự do thêm, sửa, hoặc xóa các trường dữ liệu. Cuối cùng, bạn chuyển đổi lại thành chuỗi JSON và sử dụng `res.end()` để gửi phản hồi đã được sửa đổi này về cho client.

Sử dụng phương pháp này, bạn có thể xử lý các lỗi từ PHP, ghi log, hoặc thậm chí là thêm một lớp bảo mật hoặc dữ liệu bổ sung vào phản hồi trước khi người dùng nhận được.

Bạn có muốn xem ví dụ về cách Node.js có thể xử lý việc upload file trực tiếp mà không cần proxy sang PHP không?