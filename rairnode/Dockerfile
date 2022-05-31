FROM node:latest

#version management
COPY VERSION /

#install dependencies
WORKDIR /usr/local/src
COPY package.json .
RUN npm install

COPY . /usr/local/src

EXPOSE 3000
EXPOSE 5000

CMD npm start