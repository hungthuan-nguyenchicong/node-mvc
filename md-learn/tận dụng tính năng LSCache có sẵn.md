# tận dụng tính năng LSCache có sẵn

Bạn hoàn toàn có thể bắt đầu từ thư mục gốc của dự án. Với môi trường Shared Hosting sử dụng LiteSpeed, bạn sẽ dùng một file cấu hình đặc biệt là **`.htaccess`** để ra lệnh cho máy chủ cách thức hoạt động.

Dưới đây là hướng dẫn chi tiết cho cả hai cách: qua file `.htaccess` và qua giao diện cPanel.

-----

### **Cách 1: Cấu hình qua file .htaccess**

File `.htaccess` là một file cấu hình cấp thư mục được máy chủ web LiteSpeed đọc và thực thi.

#### **Bước 1: Tạo file .htaccess**

  * Sử dụng trình quản lý tệp (File Manager) trong cPanel hoặc FTP để truy cập vào thư mục gốc của dự án Node.js của bạn.
  * Tạo một file mới và đặt tên chính xác là `.htaccess`.

#### **Bước 2: Thêm các quy tắc LSCache**

Thêm đoạn mã sau vào file `.htaccess`. Đoạn mã này sẽ hướng dẫn LiteSpeed cache các trang công khai của bạn.

```apache
<IfModule LiteSpeed>
  # Kích hoạt cache cho trang SSR
  CacheEnable public /
  # Đặt thời gian tồn tại của cache là 600 giây (10 phút)
  CacheTTL 600
  # Loại trừ các đường dẫn không nên cache
  CacheDisable public /admin/
  # Không cache các URL chứa chuỗi này
  CacheDisable public /api/
</IfModule>
```

  * **`<IfModule LiteSpeed>`**: Đảm bảo các quy tắc này chỉ được thực thi nếu máy chủ web là LiteSpeed.
  * **`CacheEnable public /`**: Chỉ thị cho LiteSpeed kích hoạt cache công khai cho thư mục gốc (`/`) của website.
  * **`CacheTTL 600`**: Đặt thời gian cache tồn tại là 600 giây (tương đương 10 phút). Sau 10 phút, bản cache sẽ hết hạn và LiteSpeed sẽ cần render lại trang.
  * **`CacheDisable public /admin/` và `CacheDisable public /api/`**: Đây là những dòng quan trọng. Nó ngăn LiteSpeed cache các trang quản trị (SPA) và các điểm cuối API, đảm bảo dữ liệu luôn được cập nhật.

-----

### **Cách 2: Cấu hình trong cPanel**

Đây là cách đơn giản và được khuyến khích hơn vì nó trực quan và ít rủi ro hơn.

#### **Bước 1: Truy cập LiteSpeed Web Cache Manager**

  * Đăng nhập vào cPanel của bạn.
  * Tìm kiếm và truy cập vào **LiteSpeed Web Cache Manager**.

#### **Bước 2: Cấu hình cho ứng dụng của bạn**

  * Trong giao diện của LiteSpeed Web Cache Manager, bạn sẽ thấy tùy chọn để quản lý cache cho từng ứng dụng hoặc website.
  * Tùy thuộc vào nhà cung cấp host, bạn có thể có một nút **"Enable LSCache"** hoặc một giao diện để thiết lập các quy tắc tương tự như trong file `.htaccess`. Giao diện này thường sẽ có các tùy chọn như:
      * Bật/tắt cache.
      * Đặt thời gian cache (Cache TTL).
      * Thiết lập các quy tắc loại trừ (Exclude Rules) cho các đường dẫn mà bạn không muốn cache (như `/admin/` và `/api/`).

**Lời khuyên:** Hãy bắt đầu với cách 2. Nếu bạn gặp vấn đề hoặc cần các tùy chỉnh nâng cao hơn, hãy sử dụng cách 1. Cả hai phương pháp đều rất hiệu quả để tận dụng tính năng LSCache có sẵn.

