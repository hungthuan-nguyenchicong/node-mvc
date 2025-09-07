# Sử dụng Express Cache Middleware

Đây là một yêu cầu rất chi tiết và cụ thể, rất phù hợp với mô hình của bạn. Tôi sẽ đi sâu vào từng giải pháp mà bạn đã nêu, cung cấp mã code minh họa và giải thích chi tiết.

-----

### **1. Sử dụng Express Cache Middleware**

Bạn có thể sử dụng thư viện **`apicache`** để thực hiện việc này. Mặc dù tên là "apicache," nó hoạt động rất tốt với các trang web thông thường.

#### **Cài đặt**

```bash
npm install apicache
```

#### **Sử dụng trong Express**

Bạn sẽ áp dụng middleware này cho các route mà bạn muốn cache.

```javascript
const express = require('express');
const apicache = require('apicache');
const app = express();
const port = 3000;

// Khởi tạo apicache
let cache = apicache.middleware;

// Sử dụng cache cho trang public SSR
app.get('/', cache('5 minutes'), (req, res) => {
    // Đây là logic SSR của bạn, ví dụ:
    const pageContent = `<h1>Trang chủ - Cập nhật lúc ${new Date()}</h1>`;
    res.send(pageContent);
});

// Đây là route API không cache, cho trang admin SPA
app.get('/api/admin', (req, res) => {
    res.json({ data: 'Dữ liệu admin' });
});

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
```

  * **cache('5 minutes')**: Dòng này chỉ định rằng kết quả render của trang sẽ được lưu cache trong 5 phút. Nếu có người truy cập lại trong thời gian này, họ sẽ nhận được phiên bản đã cache mà không cần chạy lại logic SSR.

-----

### **2. Sử dụng Nginx làm Proxy Cache**

Đây là giải pháp hiệu quả nhất để giảm tải cho Node.js, vì Nginx rất mạnh trong việc phục vụ file tĩnh và cache.

#### **Cấu hình Nginx**

Bạn cần chỉnh sửa file cấu hình của Nginx. Hãy đảm bảo Nginx đã được cài đặt và đang chạy trên VPS của bạn.

```nginx
http {
    # Định nghĩa thư mục cache cho Nginx
    proxy_cache_path /var/cache/nginx_cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

    server {
        listen 80;
        server_name your_domain.com;
        
        location / {
            # Bật cache cho trang public SSR
            proxy_cache my_cache;
            proxy_cache_valid 200 60m; # Cache các phản hồi thành công (200) trong 60 phút
            proxy_cache_revalidate on;
            proxy_cache_min_uses 1;
            proxy_cache_lock on;

            # Trỏ đến server Node.js của bạn
            proxy_pass http://localhost:3000;
        }

        location /admin/ {
            # Không cache các request của admin SPA
            proxy_cache off;
            proxy_pass http://localhost:3000;
        }
    }
}
```

  * **`proxy_cache_path`**: Tạo một vùng nhớ cache trên đĩa.
  * **`proxy_cache my_cache`**: Kích hoạt cache.
  * **`proxy_cache_valid 200 60m`**: Lưu cache các phản hồi 200 trong 60 phút. Nginx sẽ tự động kiểm tra xem có bản cache chưa, nếu có thì trả về ngay lập tức mà không cần hỏi Node.js.

-----

### **3. Sử dụng Static Site Generation (SSG) với Express**

Express không phải là một framework được xây dựng cho SSG, nhưng bạn vẫn có thể mô phỏng chức năng này bằng cách tạo ra các tệp HTML tĩnh từ Express và lưu chúng vào một thư mục.

#### **Cách thức hoạt động**

  * Bạn sẽ có một script riêng để chạy các route public và lưu kết quả render thành các file HTML.
  * Sau đó, bạn cấu hình Nginx để phục vụ các tệp HTML này thay vì chuyển tiếp yêu cầu đến Express.

#### **Mã code minh họa**

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const publicPages = ['/', '/gioi-thieu', '/lien-he'];

async function buildStaticPages() {
    console.log('Bắt đầu quá trình Static Site Generation...');
    // Tạo thư mục để lưu các file tĩnh
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    for (const page of publicPages) {
        // Mô phỏng quá trình render SSR
        const content = `<h1>Nội dung trang ${page} được render từ Server</h1>`;
        const filePath = path.join(distDir, `${page === '/' ? 'index' : page}.html`);
        
        // Lưu nội dung đã render vào file HTML
        fs.writeFileSync(filePath, content);
        console.log(`Đã tạo file: ${filePath}`);
    }
    console.log('Quá trình hoàn tất!');
}

// Chạy script này mỗi khi có thay đổi nội dung
// buildStaticPages();

// Trong server chính của bạn, bạn chỉ cần phục vụ các file tĩnh này
app.use(express.static(path.join(__dirname, 'dist')));

// Các route API vẫn được xử lý bởi Express
app.get('/api/admin', (req, res) => {
    res.json({ data: 'Dữ liệu admin' });
});

app.listen(3000, () => {
    console.log('Server đã khởi động, sẵn sàng phục vụ file tĩnh và API.');
});
```

  * **Ưu điểm:** Tốc độ tải trang cực nhanh, gần như tức thì, và giảm tải hoàn toàn cho Node.js đối với các trang công khai.
  * **Nhược điểm:** Bạn phải chạy script `buildStaticPages()` mỗi khi có nội dung mới. Đây là một cách thủ công, nhưng nó mô phỏng chính xác cách hoạt động của các plugin cache như bạn đã thấy trên WordPress.