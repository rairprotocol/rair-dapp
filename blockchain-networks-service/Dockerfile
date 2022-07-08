FROM node:latest

#install dependencies
WORKDIR /usr/local/src
COPY package*.json .
RUN npm install

COPY . /usr/local/src

EXPOSE 5001

CMD npm start
