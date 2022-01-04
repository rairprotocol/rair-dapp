FROM node:latest

#version management
COPY VERSION /

#install rairnode
WORKDIR /usr/local/src
COPY . /usr/local/src

RUN npm install

EXPOSE 3000
EXPOSE 5000

CMD npm start
