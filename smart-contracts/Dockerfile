FROM node:latest

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY package*.json ./

RUN npm i
RUN npm run hardhat:compile

CMD npm run hardhat:test
