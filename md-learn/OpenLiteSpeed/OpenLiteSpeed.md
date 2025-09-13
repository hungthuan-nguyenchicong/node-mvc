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
