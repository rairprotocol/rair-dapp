FROM node:latest

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY package*.json ./

RUN npm i @trendyol-js/react-carousel@"^2.0.0" --legacy-peer-deps
RUN npm install


EXPOSE 3001

CMD npm start