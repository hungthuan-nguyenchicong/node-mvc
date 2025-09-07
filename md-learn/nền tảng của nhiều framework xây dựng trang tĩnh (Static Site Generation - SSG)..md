# nền tảng của nhiều framework xây dựng trang tĩnh (Static Site Generation - SSG).

Chào bạn, câu hỏi của bạn rất hay. Cách tiếp cận của bạn là hoàn toàn khả thi và là nền tảng của nhiều framework xây dựng trang tĩnh (Static Site Generation - SSG).

Bạn có thể làm như sau:

-----

### **1. Lưu trữ danh sách các trang cần tạo**

Đầu tiên, bạn có thể tạo một biến để chứa danh sách các trang công khai (public) mà bạn muốn render ra file tĩnh. Biến này có thể là một mảng các đối tượng, mỗi đối tượng chứa thông tin về đường dẫn (`path`) và tên file (`filename`).

```javascript
const publicPages = [
    { path: '/', filename: 'index.html' },
    { path: '/gioi-thieu', filename: 'gioi-thieu.html' },
    { path: '/san-pham', filename: 'san-pham.html' }
];
```

-----

### **2. Tự động hóa việc tạo và xóa file**

Bạn có thể sử dụng thư viện `fs` (File System) có sẵn trong Node.js để tự động tạo và xóa các tệp `.html` này. Đây là cách làm để bạn có một endpoint quản trị riêng để xử lý việc này:

```javascript
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

const publicPages = [
    { path: '/', filename: 'index.html' },
    { path: '/gioi-thieu', filename: 'gioi-thieu.html' },
    { path: '/san-pham', filename: 'san-pham.html' }
];

const publicDir = path.join(__dirname, 'public');

// Route quản trị để tạo lại các trang tĩnh
app.get('/build-static-pages', async (req, res) => {
    try {
        if (!fs.existsSync(publicDir)) {
            await fs.mkdir(publicDir);
        }

        for (const page of publicPages) {
            // Logic render SSR của bạn, ví dụ:
            const content = `<h1>Nội dung trang ${page.path}</h1><p>Được tạo lúc ${new Date()}</p>`;
            const filePath = path.join(publicDir, page.filename);
            
            await fs.writeFile(filePath, content);
            console.log(`Đã tạo file: ${filePath}`);
        }
        res.send('Đã tạo thành công các file HTML tĩnh.');
    } catch (error) {
        console.error('Lỗi khi tạo file:', error);
        res.status(500).send('Lỗi khi tạo file HTML tĩnh.');
    }
});

// Route quản trị để xóa một trang tĩnh cụ thể
app.get('/delete-static-page', async (req, res) => {
    try {
        const filename = req.query.filename;
        if (!filename) {
            return res.status(400).send('Thiếu tên file.');
        }

        const filePath = path.join(publicDir, filename);
        await fs.unlink(filePath);
        res.send(`Đã xóa file: ${filename}`);
    } catch (error) {
        console.error('Lỗi khi xóa file:', error);
        res.status(500).send('Lỗi khi xóa file.');
    }
});

// Phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(publicDir));

// Route API (không tĩnh)
app.get('/api/data', (req, res) => {
    res.json({ message: 'Đây là dữ liệu API.' });
});

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
```

### **Ưu và Nhược điểm của cách tiếp cận này**

  * **Ưu điểm:** Bạn có toàn quyền kiểm soát quy trình, không phụ thuộc vào các thư viện cache phức tạp. Nó rất phù hợp cho các dự án nhỏ và các trang web có nội dung ít thay đổi.
  * **Nhược điểm:** Bạn phải tự quản lý tất cả các logic (kiểm tra lỗi, xóa file cũ). Khi số lượng trang tăng lên, việc quản lý bằng tay có thể trở nên khó khăn.

Cách tiếp cận này là một mô hình rất hiệu quả để giảm tải cho máy chủ. Đây cũng chính là cách mà các framework SSG hiện đại như **Next.js** và **Astro** hoạt động, nhưng chúng đã tự động hóa và tối ưu hóa toàn bộ quá trình này.

## Có, bạn hoàn toàn có thể làm điều đó. Node.js có sẵn thư viện **`fs`** (File System) để đọc và quản lý các tệp tin. Bạn có thể sử dụng hàm `fs.promises.readdir` để đọc nội dung của một thư mục, sau đó lọc ra các tệp tin có đuôi `.html`.

Dưới đây là một hàm ví dụ để thực hiện điều này:

```javascript
const fs = require('fs').promises;
const path = require('path');

async function getHtmlFiles(directoryPath) {
    try {
        // Mảng để lưu trữ các file .html
        const htmlFiles = [];
        
        // Đọc tất cả các tệp và thư mục trong đường dẫn
        const files = await fs.readdir(directoryPath);

        // Lặp qua từng tệp
        for (const file of files) {
            // Lấy đường dẫn đầy đủ của tệp
            const filePath = path.join(directoryPath, file);
            // Lấy thông tin về tệp để kiểm tra xem có phải là thư mục không
            const stats = await fs.stat(filePath);
            
            // Chỉ xử lý các tệp tin (không phải thư mục)
            if (stats.isFile()) {
                // Kiểm tra nếu đuôi mở rộng của tệp là .html
                if (path.extname(file) === '.html') {
                    // Nếu đúng, thêm vào mảng
                    htmlFiles.push(file);
                }
            }
        }
        
        return htmlFiles;

    } catch (error) {
        console.error("Lỗi khi đọc thư mục:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
}

// Ví dụ sử dụng:
// Giả sử các file .html của bạn nằm trong thư mục 'public'
const publicDirectory = path.join(__dirname, 'public');

// Gọi hàm và in ra kết quả
getHtmlFiles(publicDirectory)
    .then(files => {
        console.log("Danh sách các file HTML:", files);
    });
```

-----

### Giải thích chi tiết

  * **`fs.promises`**: Chúng ta sử dụng phiên bản `promises` của thư viện `fs` để có thể sử dụng cú pháp `async/await`. Điều này giúp mã của bạn dễ đọc và quản lý hơn vì các thao tác đọc tệp là bất đồng bộ.
  * **`fs.readdir(directoryPath)`**: Hàm này đọc toàn bộ nội dung (tệp và thư mục con) trong một thư mục và trả về một mảng tên.
  * **`path.extname(file)`**: Hàm này từ thư viện **`path`** (có sẵn trong Node.js) giúp lấy phần mở rộng của một tệp (ví dụ: '.html', '.css').
  * **`fs.stat(filePath)`**: Hàm này lấy thông tin chi tiết về một đường dẫn, cho phép chúng ta kiểm tra xem đó có phải là một tệp hay một thư mục.

  