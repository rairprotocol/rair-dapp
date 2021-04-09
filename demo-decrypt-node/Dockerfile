FROM node:latest

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install \
    libusb-dev \
    libusb-1.0.0-dev \
    libudev-dev

WORKDIR /opt/ipfs
RUN wget https://dist.ipfs.io/go-ipfs/v0.4.11/go-ipfs_v0.4.11_linux-amd64.tar.gz
RUN tar xvfz go-ipfs_v0.4.11_linux-amd64.tar.gz
RUN cp go-ipfs/ipfs /usr/local/bin
RUN ipfs init
RUN ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080


#install rairnode
WORKDIR /usr/local/src
COPY . /usr/local/src

RUN apt update
RUN apt install -y ffmpeg
RUN npm install readdirp
RUN npm install

EXPOSE 3000
EXPOSE 4001
EXPOSE 5000
EXPOSE 5001
EXPOSE 8080

RUN ["chmod", "+x", "/usr/local/src/scripts/docker_start.sh"]
CMD /usr/local/src/scripts/docker_start.sh
