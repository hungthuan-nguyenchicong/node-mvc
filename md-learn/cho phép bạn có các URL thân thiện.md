## cho phép bạn có các URL thân thiện

With modern web servers like Nginx and Apache (using `.htaccess`), you don't need to include `.html` in your URLs. You can configure the server to automatically append the file extension for you, creating clean and user-friendly URLs like `/product/may-tinh/`. This is called a **clean URL** or **friendly URL**.

-----

### **Cấu hình với Nginx**

Nginx là máy chủ web hiệu suất cao và lý tưởng cho việc tạo các URL sạch. Bạn sẽ cần chỉnh sửa file cấu hình `server` của Nginx.

```nginx
server {
    listen 80;
    server_name your_domain.com;
    root /path/to/your/project/public;

    # Cấu hình chính
    location / {
        # Thử tìm file .html tương ứng
        try_files $uri $uri.html $uri/ =404;
    }
}
```

  * **`try_files $uri $uri.html $uri/ =404;`** là dòng quan trọng nhất. Nó ra lệnh cho Nginx:
      * **`$uri`**: Thử tìm file hoặc thư mục chính xác với đường dẫn được yêu cầu (ví dụ: `/product/may-tinh`).
      * **`$uri.html`**: Nếu không tìm thấy, hãy thử thêm đuôi `.html` vào cuối đường dẫn và tìm lại (ví dụ: `/product/may-tinh.html`).
      * **`$uri/`**: Nếu vẫn không thấy, hãy thử tìm một thư mục có cùng tên (`/product/may-tinh/`).
      * **`=404`**: Nếu tất cả đều thất bại, trả về lỗi 404.

-----

### **Cấu hình với Apache (.htaccess)**

Trên Shared Hosting (thường dùng Apache hoặc LiteSpeed với `.htaccess`), bạn có thể thêm quy tắc vào file `.htaccess` trong thư mục gốc.

```apache
RewriteEngine On

# Bỏ qua các file và thư mục đã tồn tại
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Ghi lại yêu cầu để thêm .html vào cuối
RewriteRule ^(.*)$ $1.html [L,QSA]
```

  * **`RewriteEngine On`**: Kích hoạt module ghi lại URL.
  * **`RewriteCond %{REQUEST_FILENAME} !-f`**: Đảm bảo yêu cầu không trỏ đến một file có thật.
  * **`RewriteCond %{REQUEST_FILENAME} !-d`**: Đảm bảo yêu cầu không trỏ đến một thư mục có thật.
  * **`RewriteRule ^(.*)$ $1.html [L,QSA]`**: Đây là quy tắc chính. Nó sẽ thêm `.html` vào cuối URL (`$1` đại diện cho phần đường dẫn được yêu cầu). `[L]` (Last) dừng các quy tắc tiếp theo, và `[QSA]` (Query String Append) đảm bảo các tham số (ví dụ: `?id=1`) được giữ lại.

Cả hai cách trên đều cho phép bạn có các URL thân thiện mà không cần hiển thị đuôi file, giúp trải nghiệm người dùng tốt hơn và tối ưu hóa SEO.