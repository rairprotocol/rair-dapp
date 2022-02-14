#FROM node:latest

# Freez current version cause of -> https://github.com/nodejs/node/issues/41926
FROM node:17.4.0

#version management
COPY VERSION /

#install rairnode
WORKDIR /usr/local/src
COPY . /usr/local/src

RUN npm install

EXPOSE 3000
EXPOSE 5000

CMD npm start
