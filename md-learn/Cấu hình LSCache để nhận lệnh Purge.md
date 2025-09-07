## Cấu hình LSCache để nhận lệnh Purge

Để sử dụng tính năng "purge" cache của LSCache từ Node.js Express, bạn cần gửi một yêu cầu HTTP đặc biệt đến máy chủ web. Đây là cách làm chi tiết, vì LSCache không có một API purge trực tiếp cho các ứng dụng tùy chỉnh mà thay vào đó sử dụng các tiêu đề (header) HTTP.

-----

### **Cách thức hoạt động**

LSCache lắng nghe các yêu cầu với một tiêu đề HTTP cụ thể để biết khi nào cần xóa cache. Bạn sẽ tạo một endpoint trong ứng dụng Express của mình, và khi endpoint này được gọi, nó sẽ gửi một yêu cầu HTTP đặc biệt để ra lệnh cho LiteSpeed xóa cache.

### **Các bước thực hiện**

#### **Bước 1: Cấu hình LSCache để nhận lệnh Purge**

Bạn cần đảm bảo file `.htaccess` của bạn có thể nhận các yêu cầu purge.

```apache
# Thêm dòng này để cho phép các yêu cầu purge từ địa chỉ IP của bạn
<IfModule LiteSpeed>
  CacheAllowPurge <Your-IP-Address>
</IfModule>
```

*Thay `<Your-IP-Address>` bằng địa chỉ IP của VPS hoặc máy tính bạn dùng để chạy script.*\*

#### **Bước 2: Viết endpoint trong Express**

Bạn sẽ tạo một endpoint bí mật trong Express. Khi có thay đổi trong cơ sở dữ liệu (ví dụ: một bài viết được cập nhật), bạn có thể gọi endpoint này để xóa cache.

```javascript
const express = require('express');
const app = express();
const fetch = require('node-fetch'); // Cần cài đặt: npm install node-fetch

// Endpoint bí mật để gửi lệnh purge
app.get('/purge-cache', async (req, res) => {
    try {
        // Địa chỉ IP của bạn hoặc localhost nếu đang chạy trên cùng server
        const yourIP = '127.0.0.1'; 
        const siteDomain = 'your_domain.com';

        // Gửi yêu cầu HTTP đặc biệt đến chính server của bạn
        const response = await fetch(`http://${siteDomain}/`, {
            method: 'GET',
            headers: {
                // Tiêu đề quan trọng để ra lệnh cho LSCache
                'X-LiteSpeed-Purge': 'public, /', 
                // Sử dụng IP của bạn để LSCache nhận dạng
                'X-Forwarded-For': yourIP 
            }
        });

        if (response.ok) {
            console.log('Cache đã được xóa thành công.');
            res.send('Cache đã được xóa.');
        } else {
            console.error('Lỗi khi xóa cache:', response.statusText);
            res.status(500).send('Lỗi khi xóa cache.');
        }

    } catch (error) {
        console.error('Lỗi kết nối:', error);
        res.status(500).send('Lỗi kết nối.');
    }
});
```

#### **Bước 3: Tự động hóa quá trình Purge**

Thay vì gọi thủ công, bạn nên tích hợp việc gọi endpoint `/purge-cache` này vào logic cập nhật nội dung của bạn.

**Ví dụ:** Khi bạn xử lý việc cập nhật một bài viết, hãy thêm đoạn code để gọi endpoint purge sau khi việc cập nhật database hoàn tất.

```javascript
// Ví dụ về logic cập nhật bài viết
function updatePostAndPurgeCache(postId, newContent) {
    // 1. Cập nhật bài viết trong database
    updateDatabase(postId, newContent);

    // 2. Gửi lệnh purge để xóa cache của trang đó
    // Lưu ý: Tùy chỉnh URL để xóa cache của trang cụ thể
    fetch(`http://your_domain.com/purge-cache`, { /*... headers ...*/ }); 
}
```

Đây là cách hiệu quả để đảm bảo người dùng luôn thấy nội dung mới nhất mà vẫn tận dụng được sức mạnh của LSCache.

## v2
// Gửi yêu cầu HTTP để xóa cache của một trang cụ thể
const specificPostSlug = '/bai-viet-moi';

const response = await fetch(`http://${siteDomain}${specificPostSlug}`, {
    method: 'GET',
    headers: {
        'X-LiteSpeed-Purge': `public, ${specificPostSlug}`,
        'X-Forwarded-For': yourIP
    }
});

## Phương pháp A: Xóa tệp bộ nhớ đệm.  với nginx

const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/purge-nginx-cache', (req, res) => {
    // This command finds and deletes the cache file for a specific URL
    const urlToPurge = 'http://your_domain.com/bai-viet-moi';
    const cacheKey = require('crypto').createHash('md5').update(urlToPurge).digest('hex');

    // The actual cache file path is more complex, but this shows the concept
    // You would need to determine the full path based on your Nginx configuration
    const cacheFilePath = `/var/cache/nginx/.../${cacheKey}`;

    exec(`rm -f ${cacheFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error purging cache.');
        }
        res.send('Nginx cache purged successfully.');
    });
});
