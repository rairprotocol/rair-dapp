#FROM node:latest

# Freez current version cause of -> https://github.com/nodejs/node/issues/41926
FROM node:17.4.0
#version management
COPY VERSION /
#install blockchain-networks
WORKDIR /usr/local/src
COPY . /usr/local/src
RUN npm install
EXPOSE 5001
CMD npm start
