# node-mvc
rm -rf node_modules

npm init -y

npm install

"type": "module"

# .gitignore
/node_modules
.env*

# wsl
## dịch vụ đang chạy
sudo service --status-all
## ngưng mặc đinh khởi động
sudo systemctl stop postgresql
## Gỡ bỏ các gói cụ thể
sudo apt-get remove nginx postgresql
## Tự động gỡ bỏ các gói không còn cần thiết
sudo apt-get autoremove
## Dọn dẹp bộ nhớ đệm (cache)
sudo apt-get clean
# Cài đặt lại gói
sudo apt-get install <tên_gói>
# Cập nhật gói
sudo apt-get install --reinstall <tên_gói>
# Khắc phục các phụ thuộc bị hỏng
## Tự động sửa lỗi phụ thuộc
sudo apt-get -f install
## Tự động gỡ các gói không cần thiết:
sudo apt-get autoremove

## Gỡ bỏ hoàn toàn các gói và tệp cấu hình:
sudo apt purge postgresql\*

sudo apt autoremove

## scss
npm install -D sass-embedded
## vite-include-html-plugin
npm vite-include-html-plugin