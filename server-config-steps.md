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

// write a systemd file as above
sudo nano /etc/systemd/system/rair-node.service

[Unit]
Description=RAIR Node
After=network.target

[Service]
User=rair
Environment=JWT_SECRET=UGt70v4#mZ0J@vHFK%b
Environment=INFURA_PROJECT_ID=f8232f48540f48f0a7543643e57d6278
Environment=IPFS_GATEWAY=http://localhost:8080/ipfs
Environment=IPFS_API=http://localhost:5001
Environment=PORT=500

WorkingDirectory=/home/rair/demo-decrypt-node
ExecStart=/snap/bin/node bin/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

//

Start the service and set to run at startup
sudo systemctl start rair-node
sudo systemctl enable rair-node
```

## Set up the dashboard webpage

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

```shell
cd demo-decrypt-node
git pull origin master
npm install
sudo systemctl restart rair-node
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
