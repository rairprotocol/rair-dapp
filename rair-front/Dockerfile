FROM node:lts AS build

#install dependencies
WORKDIR /usr/src/minting
COPY package.json ./
RUN npm install --force
COPY . /usr/src/minting
WORKDIR /usr/src/minting

EXPOSE 3001

CMD npm start