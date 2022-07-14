FROM node:latest as build

#version management
COPY VERSION /

#install dependencies
WORKDIR /usr/src/event-listener
COPY package*.json ./
RUN npm install
RUN npm install -g npm@8.14.0
COPY . /usr/src/event-listener
#RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

FROM node:latest
WORKDIR /usr/src/event-listener
COPY --from=build /usr/src/event-listener /usr/src/event-listener

EXPOSE 5001

CMD npm start  