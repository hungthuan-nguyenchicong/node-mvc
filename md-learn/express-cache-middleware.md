## cache
express-cache-middleware

Bạn đã nắm bắt rất đúng nút thắt cổ chai của mô hình này. Việc tạo ra một tệp tin tĩnh từ kết quả render là một giải pháp hoàn hảo để giảm tải cho CPU và loại bỏ hoàn toàn nút thắt SSR.

Đây chính là lúc chúng ta sử dụng các thư viện hoặc công nghệ cache để làm việc đó. Có một số cách tiếp cận để giải quyết vấn đề này trong môi trường Node.js.

---

### **1. Sử dụng Middleware Cache trong Express**

Đây là cách đơn giản và phổ biến nhất để cache kết quả render của các trang web. Bạn sẽ cài đặt một thư viện middleware, và nó sẽ tự động lưu lại kết quả của một trang được render lần đầu tiên.

* **Cách thức hoạt động:** Khi một người dùng truy cập trang `/` lần đầu tiên, Node.js sẽ render trang đó và middleware sẽ lưu lại kết quả (dưới dạng file HTML hoặc trong bộ nhớ). Các lần truy cập tiếp theo, middleware sẽ trả về file HTML đã được cache mà không cần chạy lại quá trình render, giúp giảm đáng kể thời gian phản hồi.
* **Thư viện đề xuất:**
    * `express-cache-middleware`: Một thư viện đơn giản, dễ tích hợp.
    * `apicache`: Được thiết kế cho API nhưng cũng có thể dùng cho trang web, có nhiều tùy chọn cấu hình mạnh mẽ.

### **2. Sử dụng Static Site Generation (SSG)**

Đây là cách tiếp cận mạnh mẽ nhất, giống hệt như những gì bạn thấy ở các plugin WordPress. Thay vì render trang khi có yêu cầu, bạn sẽ **render trang đó thành tệp HTML tĩnh tại thời điểm build**.

* **Cách thức hoạt động:** Bạn sẽ sử dụng các framework chuyên biệt như **Next.js** hoặc **Astro** để render các trang công khai (public) thành các tệp tĩnh. Sau khi build xong, bạn sẽ chỉ cần Nginx phục vụ các tệp HTML này. Nút thắt SSR hoàn toàn biến mất vì quá trình render đã được thực hiện từ trước.
* **Ưu điểm:** Tốc độ tải trang cực nhanh, gần như tức thì.
* **Nhược điểm:**
    * Không phù hợp với các trang có nội dung thường xuyên thay đổi (ví dụ: tin tức, giá sản phẩm).
    * Yêu cầu bạn phải "build" lại toàn bộ trang web mỗi khi có nội dung mới, và có thể tốn thời gian.

### **3. Sử dụng Bộ nhớ Cache (Redis)**

Nếu bạn muốn kiểm soát chi tiết hơn, bạn có thể sử dụng một bộ nhớ cache bên ngoài như **Redis** để lưu trữ các kết quả render hoặc dữ liệu API.

* **Cách thức hoạt động:** Khi có yêu cầu, Node.js sẽ kiểm tra xem dữ liệu hoặc trang web đã có trong Redis chưa. Nếu có, nó sẽ lấy dữ liệu từ đó mà không cần truy vấn database hay render lại.
* **Thư viện đề xuất:** `ioredis` (cho Redis).

### **4. Cấu hình Nginx làm Proxy Cache**

Đây là một giải pháp tối ưu ở tầng máy chủ web. Bạn có thể cấu hình Nginx để hoạt động như một bộ đệm (cache) cho các yêu cầu gửi đến Node.js.

* **Cách thức hoạt động:** Nginx sẽ nhận yêu cầu từ người dùng, nếu lần đầu tiên, nó sẽ chuyển tiếp đến Node.js. Khi Node.js trả về kết quả, Nginx sẽ lưu lại bản sao của kết quả đó. Các yêu cầu sau, Nginx sẽ trả về bản sao đã lưu mà không cần gửi đến Node.js.
* **Ưu điểm:** Nginx rất hiệu quả trong việc xử lý cache. Nó giúp giảm tải đáng kể cho Node.js, cho phép Node.js chỉ tập trung vào các tác vụ phức tạp (ví dụ: API của admin).

---

### **Kết luận**

Với mô hình của bạn:
* Để giải quyết nút thắt cho trang **SSR công khai (`/`)**, bạn nên xem xét sử dụng **Static Site Generation (SSG)** với các framework như **Next.js** hoặc **Astro**. Sau đó, bạn chỉ cần cấu hình Nginx để phục vụ các tệp HTML tĩnh đã được tạo ra.
* Đối với API của admin (`/admin/`), bạn có thể sử dụng **Middleware Cache** hoặc **Redis Cache** để tăng tốc độ phản hồi cho các yêu cầu lặp lại, giúp client (SPA) hoạt động mượt mà hơn.
## Cấu hình Nginx làm Proxy Cache

