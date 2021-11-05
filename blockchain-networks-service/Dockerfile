FROM node:latest

RUN apt-get upgrade
RUN apt-get update
RUN apt-get -y install \
    libusb-dev \
    libusb-1.0.0-dev \
    libudev-dev

#version management
COPY VERSION /

#install blockchain-networks
WORKDIR /usr/local/src
COPY . /usr/local/src

RUN apt update
RUN npm install

EXPOSE 5001

CMD npm start
