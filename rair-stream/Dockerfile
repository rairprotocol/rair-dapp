FROM node:lts as build

#install dependencies
WORKDIR /usr/src/media-service
COPY package.json ./
RUN npm install
COPY . /usr/src/media-service

FROM node:lts
WORKDIR /usr/src/media-service
COPY --from=build /usr/src/media-service /usr/src/media-service

EXPOSE 5002

CMD npm start