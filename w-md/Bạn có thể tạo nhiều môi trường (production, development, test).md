# Bạn có thể tạo nhiều môi trường (production, development, test)

Bạn có thể tạo nhiều môi trường (`production`, `development`, `test`) và quản lý các giá trị khác nhau trong các file `.env` riêng biệt. Cách làm phổ biến và hiệu quả nhất là tạo nhiều file `.env` tương ứng với mỗi môi trường và sử dụng một biến môi trường để chọn file phù hợp khi chạy ứng dụng.

-----

### Cấu trúc file `.env`

Tạo các file `.env` riêng biệt trong thư mục gốc của dự án:

  * `.env.development`: Chứa các biến cho môi trường phát triển.
  * `.env.production`: Chứa các biến cho môi trường sản xuất.
  * `.env.test`: Chứa các biến cho môi trường kiểm thử.
  * `.env`: Chứa các biến chung, sẽ được load mặc định nếu không có biến nào khác được chỉ định.

**Ví dụ:**

**`.env.development`**

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
```

**`.env.production`**

```
NODE_ENV=production
PORT=80
DB_HOST=your-production-database-url
DB_USER=your-production-db-user
```

-----

### Cài đặt và sử dụng `dotenv`

Sử dụng thư viện `dotenv` cùng với một biến môi trường để xác định file `.env` cần load.

1.  **Cài đặt `dotenv` và `cross-env`**: `cross-env` giúp bạn thiết lập biến môi trường một cách nhất quán trên mọi hệ điều hành.

    ```bash
    npm install dotenv cross-env
    ```

2.  **Định nghĩa trong `package.json`**: Thêm các script để khởi chạy ứng dụng với từng môi trường cụ thể.

    ```json
    "scripts": {
      "dev": "cross-env ENV_FILE=.env.development node server.js",
      "pro": "cross-env ENV_FILE=.env.production node server.js",
      "test": "cross-env ENV_FILE=.env.test node server.js",
      "start": "node server.js"
    }
    ```

    Ở đây, chúng ta tạo một biến môi trường tùy chỉnh là `ENV_FILE` để chứa tên file `.env` tương ứng.

-----

### Sử dụng trong code Node.js

Trong file server chính của bạn (ví dụ: `server.js`), bạn sẽ đọc biến `ENV_FILE` để load file `.env` tương ứng.

```javascript
// server.js
import dotenv from 'dotenv';
import path from 'path';

// Xác định file .env cần load. Mặc định là .env
const envFile = process.env.ENV_FILE || '.env';

// Load các biến môi trường từ file tương ứng
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Bây giờ, bạn có thể truy cập các biến môi trường
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;

console.log(`Ứng dụng đang chạy ở cổng: ${port}`);
console.log(`Kết nối đến database host: ${dbHost}`);
```

Với cách này, khi bạn chạy `npm run dev`, script sẽ thiết lập `ENV_FILE=.env.development`, và `dotenv` sẽ load các biến từ file `.env.development`. Tương tự, khi chạy `npm run pro`, nó sẽ load file `.env.production`, giúp bạn quản lý các thiết lập riêng biệt cho từng môi trường một cách rõ ràng.