FROM node:latest

#install dependencies
WORKDIR /usr/local/src
COPY package*.json .
RUN npm install

COPY . /usr/local/src

EXPOSE 5002

CMD npm start
