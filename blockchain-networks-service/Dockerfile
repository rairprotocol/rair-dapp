#FROM node:latest

# Freez current version cause of -> https://github.com/nodejs/node/issues/41926
FROM node:latest
#install blockchain-networks
WORKDIR /usr/local/src
COPY . /usr/local/src
COPY package*.json ./
RUN npm install
EXPOSE 5001
CMD npm start
