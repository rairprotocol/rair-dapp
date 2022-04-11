FROM node:16.13.0

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . /usr/src/app
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

EXPOSE 3001

CMD npm start