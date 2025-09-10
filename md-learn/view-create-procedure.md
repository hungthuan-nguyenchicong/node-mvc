## VIEW - CREATE PROCEDURE

Khi làm việc với MySQL, bạn có thể đặt tên cho một câu lệnh truy vấn (query) bằng cách sử dụng **view** hoặc **stored procedure**. Cả hai phương pháp này đều giúp bạn lưu lại một câu lệnh truy vấn phức tạp và gọi lại nó bằng một tên đơn giản hơn. Điều này giúp cải thiện khả năng quản lý mã nguồn, tái sử dụng, và tăng cường bảo mật.

-----

### Sử dụng VIEW

**VIEW** là một bảng ảo dựa trên kết quả của một câu lệnh `SELECT`. Thay vì lưu trữ dữ liệu vật lý, nó lưu trữ chính câu lệnh truy vấn đó. Khi bạn truy vấn đến view, MySQL sẽ thực thi câu lệnh `SELECT` đã được định nghĩa và trả về kết quả.

#### Cách tạo VIEW

Cú pháp để tạo một view rất đơn giản:

```sql
CREATE VIEW ten_view AS
SELECT cột1, cột2, ...
FROM ten_bang
WHERE điều_kiện;
```

**Ví dụ:**

Giả sử bạn thường xuyên truy vấn danh sách các sản phẩm đang có số lượng tồn kho thấp hơn 10. Bạn có thể tạo một view để đơn giản hóa thao tác này:

```sql
CREATE VIEW SanPhamTonKhoThap AS
SELECT MaSP, TenSP, SoLuongTonKho
FROM san_pham
WHERE SoLuongTonKho < 10;
```

Sau khi tạo view, bạn có thể gọi nó như một bảng thông thường:

```sql
SELECT * FROM SanPhamTonKhoThap;
```

-----

### Sử dụng Stored Procedure

**Stored procedure** là một tập hợp các câu lệnh SQL được lưu trữ trong cơ sở dữ liệu. Nó giống như một hàm hoặc thủ tục con, có thể nhận tham số đầu vào và trả về kết quả. Stored procedure đặc biệt hữu ích khi bạn cần thực hiện các thao tác phức tạp hơn, bao gồm nhiều câu lệnh SQL khác nhau (ví dụ: `SELECT`, `INSERT`, `UPDATE`).

#### Cách tạo Stored Procedure

Cú pháp để tạo một stored procedure như sau:

```sql
DELIMITER //

CREATE PROCEDURE ten_procedure()
BEGIN
    -- Các câu lệnh SQL của bạn
    SELECT cột1, cột2, ...
    FROM ten_bang
    WHERE điều_kiện;
END //

DELIMITER ;
```

**Ví dụ:**

Tiếp tục ví dụ trên, nếu bạn muốn không chỉ truy vấn mà còn thực hiện một số thao tác khác sau đó, stored procedure là lựa chọn phù hợp:

```sql
DELIMITER //

CREATE PROCEDURE LaySanPhamTonKhoThap()
BEGIN
    SELECT MaSP, TenSP, SoLuongTonKho
    FROM san_pham
    WHERE SoLuongTonKho < 10;
END //

DELIMITER ;
```

Để gọi stored procedure này, bạn dùng lệnh `CALL`:

```sql
CALL LaySanPhamTonKhoThap();
```

-----

### Tóm tắt và Lựa chọn

| Tính năng | **VIEW** | **Stored Procedure** |
| :--- | :--- | :--- |
| **Mục đích** | Tạo bảng ảo cho câu lệnh `SELECT`. | Thực hiện một chuỗi các câu lệnh SQL. |
| **Sự phức tạp** | Chỉ có thể chứa một câu lệnh `SELECT`. | Có thể chứa nhiều câu lệnh SQL (`SELECT`, `INSERT`, `UPDATE`, v.v.). |
| **Tham số** | Không hỗ trợ tham số. | Hỗ trợ tham số đầu vào và đầu ra. |
| **Ứng dụng** | Đơn giản hóa các truy vấn `SELECT` phức tạp, tạo ra lớp bảo mật cho dữ liệu. | Tự động hóa các tác vụ, xử lý logic nghiệp vụ phức tạp, nâng cao hiệu suất. |

Cả hai cách đều cho phép bạn đặt một "tên" cho câu lệnh truy vấn của mình. **Bạn nên sử dụng VIEW khi câu lệnh của bạn chỉ là một truy vấn `SELECT` đơn thuần và cần được tái sử dụng thường xuyên. Ngược lại, hãy sử dụng Stored Procedure khi bạn cần thực hiện các tác vụ phức tạp hơn hoặc cần truyền tham số vào câu lệnh.**

## them xua xoa

Chào bạn,

Đúng vậy, cả **VIEW** và **Stored Procedure** đều được tạo và định nghĩa hoàn toàn trên máy chủ MySQL. Chúng được lưu trữ trong cơ sở dữ liệu và có thể được gọi để sử dụng bất cứ lúc nào, giúp bạn không cần phải viết lại các câu lệnh phức tạp.

Dưới đây là cách bạn có thể xem, sửa đổi và xóa chúng.

-----

### **1. Đối với VIEW**

| Thao tác | Cú pháp SQL | Giải thích |
| :--- | :--- | :--- |
| **Xem danh sách** | `SHOW FULL TABLES IN ten_database WHERE table_type = 'VIEW';` | Lệnh này sẽ liệt kê tất cả các view trong cơ sở dữ liệu. |
| **Xem định nghĩa** | `SHOW CREATE VIEW ten_view;` | Lệnh này sẽ hiển thị câu lệnh `CREATE VIEW` ban đầu mà bạn đã dùng để tạo view, bao gồm cả câu truy vấn `SELECT` bên trong. |
| **Sửa đổi** | `ALTER VIEW ten_view AS <câu lệnh SELECT mới>;` \<br\> hoặc \<br\> `CREATE OR REPLACE VIEW ten_view AS <câu lệnh SELECT mới>;` | **ALTER VIEW** được dùng để thay đổi định nghĩa của một view hiện có. \<br\> **CREATE OR REPLACE VIEW** là một cách thay thế, nó sẽ tạo một view mới nếu chưa tồn tại hoặc thay thế view cũ nếu đã có. |
| **Xóa** | `DROP VIEW ten_view;` | Lệnh này sẽ xóa view ra khỏi cơ sở dữ liệu. |

-----

### **2. Đối với Stored Procedure**

| Thao tác | Cú pháp SQL | Giải thích |
| :--- | :--- | :--- |
| **Xem danh sách** | `SHOW PROCEDURE STATUS WHERE Db = 'ten_database';` | Lệnh này liệt kê thông tin về tất cả các stored procedure trong cơ sở dữ liệu của bạn. |
| **Xem định nghĩa** | `SHOW CREATE PROCEDURE ten_procedure;` | Lệnh này sẽ hiển thị toàn bộ câu lệnh `CREATE PROCEDURE` ban đầu của bạn. |
| **Sửa đổi** | `ALTER PROCEDURE ten_procedure <các thay đổi>;` | Trong MySQL, lệnh `ALTER PROCEDURE` **không** cho phép bạn thay đổi thân (body) của procedure. Thay vào đó, nó chỉ cho phép bạn thay đổi một số đặc điểm như `COMMENT`, `SQL SECURITY`, hoặc `CONTAINS SQL`. |
| **Cách sửa đổi hiệu quả** | `DROP PROCEDURE IF EXISTS ten_procedure;` \<br\> `DELIMITER //` \<br\> `CREATE PROCEDURE ten_procedure(...) BEGIN ... END //` \<br\> `DELIMITER ;` | Vì MySQL không cho phép sửa đổi thân của stored procedure, cách phổ biến nhất là **xóa nó đi và tạo lại** với định nghĩa mới. |
| **Xóa** | `DROP PROCEDURE ten_procedure;` | Lệnh này sẽ xóa stored procedure khỏi cơ sở dữ liệu. |

