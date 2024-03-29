#!/bin/bash
echo 'Connect to Server...'

# Если npm install завершается Killed
# sudo fallocate -l 1G /swapfile
# sudo chmod 600 /swapfile
# sudo mkswap /swapfile
# sudo swapon /swapfile
# sudo swapon --show
# sudo cp /etc/fstab /etc/fstab.bak
# echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
# sudo sysctl vm.swappiness=10
# echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
# sudo sysctl vm.vfs_cache_pressure=50
# echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf

umask 777
ssh -tt -i ~/.ssh/id_rsa root@89.223.64.41 << EOF
sudo apt -y update
sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs
node -v
npm -v
sudo apt -y install nginx
sudo apt -y install git
sudo apt -y install mongodb-server
sudo apt -y install certbot python3-certbot-nginx
sudo apt-get -y install build-essential
sudo npm install -g pm2
sudo npm install -g nx
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
sudo /sbin/mkswap /var/swap.1
sudo /sbin/swapon /var/swap.1
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo ufw enable
ufw allow ssh
git clone https://github.com/Sasha9a/Scrum-Plandov.git -b v0.0.3
cd Scrum-Plandov
sudo npm install
nx affected:build --all --prod
sudo mkdir -p /var/www/scrum.plandov.ru/html
sudo chown -R $USER:$USER /var/www/scrum.plandov.ru/html
sudo chmod -R 755 /var/www/scrum.plandov.ru
sudo cp deploy/nginx.conf /etc/nginx/sites-available/scrum.plandov.ru
sudo ln -s /etc/nginx/sites-available/scrum.plandov.ru /etc/nginx/sites-enabled/
sudo cp -r ~/Scrum-Plandov/dist/apps/web/* /var/www/scrum.plandov.ru/html
sudo certbot --nginx --reinstall --redirect -d scrum.plandov.ru -d www.scrum.plandov.ru
sudo systemctl enable mongodb
sudo pm2 start dist/apps/api/main.js
sudo pm2 save
sudo pm2 startup
exit
EOF

echo 'Finish!'
