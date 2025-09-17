# OpenLiteSpeed

sudo apt update
sudo apt upgrade

## https://docs.openlitespeed.org/installation/repo/

sudo wget -O - https://repo.litespeed.sh | sudo bash

sudo apt-get -y install openlitespeed

sudo systemctl status lsws
sudo systemctl enable lshttpd.service

sudo /usr/local/lsws/admin/misc/admpass.sh


http://localhost:8088

http://localhost:7080/

sudo catch /usr/local/lsws/admin/conf/admin_config.conf

listener adminListener{
  address               *:7080
  secure                1
  keyFile               $SERVER_ROOT/admin/conf/webadmin.key
  certFile              $SERVER_ROOT/admin/conf/webadmin.crt
  clientVerify          0
}

sudo nano /usr/local/lsws/admin/conf/admin_config.conf

secure                0

sudo systemctl restart lsws

http://localhost:7080/

## https://docs.openlitespeed.org/config/

sudo chown lsadm:lsadm /var/www/html/node-mvc/openLiteSpeed/nodeMvc/conf

Virtual Host Name = nodeMvc
Virtual Host Root = /var/www/html/node-mvc/openLiteSpeed/nodeMvc
Config File = $SERVER_ROOT/conf/vhosts/nodeMvc/vhost.conf
Enable Scripts/ExtApps = Yes
Restrained = No

Click the Save button, return to Example2's configuration, and change the following settings under the General tab:

Document Root = /var/www/html/node-mvc/openLiteSpeed/nodeMvc/public
Index Files = index.html, index.php

### index.php <?php phpinfo() ?>

We recommend enabling the Rewrite feature as well. Change the following settings under the Rewrite tab:

Enable Rewrite = Yes
Auto Load from .htaccess = yes

## Create a Listener

Click the Add button to create an HTTP listener with following settings:

Listener Name = HTTP
IP Address = ANY IPv4
Port = 80
Secure = No

## Map Virtual Hosts

Virtual Host = nodeMvc
Domains = localhost.com, www.example2.com