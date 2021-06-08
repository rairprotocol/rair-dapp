FROM node:latest

RUN apt-get upgrade
RUN apt-get update
RUN apt-get -y install \
    libusb-dev \
    libusb-1.0.0-dev \
    libudev-dev

#install rairnode
WORKDIR /usr/local/src
COPY . /usr/local/src

RUN apt update
RUN apt install -y ffmpeg
RUN npm install

EXPOSE 3000
EXPOSE 5000

CMD npm start
