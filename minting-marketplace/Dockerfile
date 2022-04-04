FROM node:16.13.0

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY package*.json ./

RUN npm i @trendyol-js/react-carousel@"^2.0.1" --legacy-peer-deps
RUN npm install


EXPOSE 3001

CMD npm start