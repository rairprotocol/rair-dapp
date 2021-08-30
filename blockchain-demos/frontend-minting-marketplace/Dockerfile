FROM node:latest

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm run build

EXPOSE 3001

CMD npm start