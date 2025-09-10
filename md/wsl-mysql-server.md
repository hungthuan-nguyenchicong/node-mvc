# MySQL Server
sudo apt install mysql-server

sudo systemctl start mysql

sudo systemctl status mysql

# Cấu hình bảo mật
sudo mysql_secure_installation

sudo mysql

# Nếu bạn muốn đăng nhập với mật khẩu, hãy sử dụng:
suod mysql -u root -p
# Tạo tài khoản mới
CREATE USER 'admin_user'@'%' IDENTIFIED BY 'password';

# Cấp quyền
GRANT ALL PRIVILEGES ON *.* TO 'admin_user'@'%' WITH GRANT OPTION;

# Áp dụng các thay đổi
FLUSH PRIVILEGES;

# Xem danh sách các User
SELECT user, host FROM mysql.user;
# Xem quyền của một User cụ thể
SHOW GRANTS FOR 'ten_user'@'host';
# Test đăng nhập
sudo mysql -h <host_ip> -u <user_name> -p

# Hiển thị cơ sở dữ liệu hiện có:

SHOW DATABASES;

# Tạo cơ sở dữ liệu mới:
CREATE DATABASE ten_co_so_du_lieu;
# Sử dụng một cơ sở dữ liệu:
USE ten_co_so_du_lieu;

# Xem đang ở database nào
SELECT DATABASES()
# Xem các bảng trong database
SHOW TABLES

# Tạo bảng:

CREATE TABLE users ( id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL, email VARCHAR(100) UNIQUE );

# xem cấu trúc bảng
DESCRIBE ten_bang;

DESC ten_bang;

# Chèn dữ liệu vào bảng:
INSERT INTO users (username, email) VALUES ('user1', 'user1@example.com');

# Hiển thị dữ liệu từ bảng:
SELECT * FROM users;

# Xóa cơ sở dữ liệu:
DROP DATABASE ten_co_so_du_lieu;

# Thoát khỏi MySQL
EXIT;