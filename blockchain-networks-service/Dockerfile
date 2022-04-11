FROM node:16.13.0

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . /usr/src/app


EXPOSE 5001

CMD npm start