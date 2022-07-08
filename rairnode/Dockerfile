FROM node:latest

#version management
COPY VERSION /

#install dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . /usr/src/app
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

EXPOSE 3000
EXPOSE 5000

CMD npm start  