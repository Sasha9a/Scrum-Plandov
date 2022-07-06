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
ssh -tt -i ~/.ssh/id_rsa root@85.193.86.74 << EOF
cd Grace-Scrum
sudo git pull
sudo npm install
nx affected:build --all --prod
sudo cp deploy/nginx.conf /etc/nginx/sites-available/scrum-nash.ru
sudo ln -s /etc/nginx/sites-available/scrum-nash.ru /etc/nginx/sites-enabled/
sudo cp -r ~/Grace-Scrum/dist/apps/web/* /var/www/scrum-nash.ru/html
sudo certbot --nginx --reinstall --redirect -d scrum-nash.ru -d www.scrum-nash.ru
sudo pm2 restart 0
exit
EOF

echo 'Finish!'
