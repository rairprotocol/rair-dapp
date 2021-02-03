## Details

ip: 78.47.204.120

## Set up new user

```shell
ssh root@78.47.204.120

// enter password from email and set up new root password

adduser rair
// fill in details and add new password for user
usermod -aG sudo rair // make it a sudo user
exit
```

## Install node+IPFS

```shell
ssh rair@78.47.204.120
sudo apt update
sudo apt install snapd

sudo snap install ipfs
sudo snap install node --classic

// reboot to set up snaps
sudo shutdown -r now
```


## Set up IPFS and add as startup task
```shell
ipfs init --profile server
sudo nano /etc/systemd/system/ipfs.service

// paste in the following and save


[Unit]
Description=IPFS daemon
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=simple
User=rair
ExecStart=/snap/bin/ipfs daemon
Restart=on-failure

[Install]
WantedBy=multiuser.target



/// then run
sudo systemctl start ipfs
sudo systemctl enable ipfs
```

## Set up RAIR node service

```shell
sudo apt install git
git clone https://git.eyss.io/willem.olding/demo-decrypt-node.git
cd demo-decrypt-node
npm install
```

## systemd had some issues with automated IPFS pins
## PM2 was used instead to maintain the service running
## a .env file (needs npm module dotenv) was also used for
## enviroment variables

```shell
npm install -g pm2
cd demo-decrypt-node
pm2 start npm --name "rair" -- start
```

## PM2 commands 
```shell
pm2 stop rair
pm2 start rair
pm2 restart rair
pm2 logs rair
```

## Contents of the .env file
JWT_SECRET=UGt70v4#mZ0J@vHFK%b
INFURA_PROJECT_ID=f8232f48540f48f0a7543643e57d6278
IPFS_GATEWAY=http://localhost:8080/ipfs
IPFS_API=http://localhost:5001
PORT=5000
PINATA_KEY=aaa581a498f99ed85279
PINATA_SECRET=92a0712843d62a70a2cad282bb7369b42be4ddd288543cc861a792d91d3c10a1

## Set up the dashboard webpage (Old)
```shell
// better to build locally then upload to server

// in a local shell
git clone https://git.eyss.io/willem.olding/decrypt-node-ui-reboot
cd decrypt-node-ui
npm install && npm run build
scp -r ./build rair@78.47.204.120:/home/rair/

// log back in to the server
sudo cp -r build/ /var/www
```

## Set up the dashboard webpage (Current)
```shell
// better to build locally then upload to server

// in a local shell
git clone https://git.eyss.io/jmsm412/rair-front.git
cd rair-front
npm install && npm run build
scp -r ./build rair@78.47.204.120:/home/rair/

// log back in to the server
sudo cp -r build/ /var/www
```

## Set up NGINX web server and Reverse Proxy
```shell
apt install -y nginx
sudo ufw allow 80
sudo systemctl enable nginx
systemctl start nginx

sudo nano /etc/nginx/conf.d/app.conf
// paste the following and save

server {
  listen 80 default_server;
  listen [::]:80 default_server;
  root /var/www;

  location / {
    index index.html;
    try_files $uri $uri/ /index.html;
  }

  location ~ ^/(api|stream) {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

// restart nginx with the new config

sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
```

# Updating server with code updates

Since there is no CI/CD set up this is a manual process.

## Update the rair-node
## Automated process is inside the EYSS-Juan branch

```shell
cd demo-decrypt-node
git pull origin master
npm install
pm2 restart rair
```

## Update the UI
```shell
// locally 
cd decrypt-node-ui
git pull origin master
npm install && npm run build
scp -r ./build rair@78.47.204.120:/home/rair/

// log back in to the server
sudo rm -rf /var/www
sudo cp -r build/ /var/www
```