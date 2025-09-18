# error.log

sudo tail -f /usr/local/lsws/logs/error.log


sudo chown www-data:www-data /var/www/html/node-mvc/openLiteSpeed/nodeMvc/public/uploads

sudo nano /usr/local/lsws/conf/httpd_config.conf

serverName

user                      nobody

group                     nogroup

sudo chown nobody:nogroup /var/www/html/node-mvc/openLiteSpeed/nodeMvc/public/uploads

sudo usermod -aG nogroup cong

sudo chmod g+w /var/www/html/node-mvc/openLiteSpeed/nodeMvc/public/uploads

sudo chown cong:cong /var/www/html/node-mvc/openLiteSpeed/nodeMvc/public/uploads/chup-hinh.jpg

sudo chown nobody:nogroup /var/www/html/node-mvc/openLiteSpeed/nodeMvc/public/uploads

sudo chmod 777 /var/www/html/node-mvc/openLiteSpeed/nodeMvc/public/uploads
sudo usermod -aG nogroup cong

sudo tail -f /usr/local/lsws/logs/error.log

sudo systemctl restart lsws
