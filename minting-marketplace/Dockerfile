FROM node:16.13.0

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY package*.json ./


RUN npm install


EXPOSE 3001

CMD npm start