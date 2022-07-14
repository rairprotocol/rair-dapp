FROM node:latest as build

#install dependencies
WORKDIR /usr/src/media-service
COPY package*.json ./
RUN npm install
RUN npm install -g npm@8.14.0
COPY . /usr/src/media-service
#RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

FROM node:latest
WORKDIR /usr/src/media-service
COPY --from=build /usr/src/media-service /usr/src/media-service

EXPOSE 5002

CMD npm start  