FROM node:lts AS build

#version management
COPY VERSION /

#install dependencies
WORKDIR /usr/src/event-listener
COPY package.json ./
RUN npm install
COPY . /usr/src/event-listener
#RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

FROM node:lts
WORKDIR /usr/src/event-listener
COPY --from=build /usr/src/event-listener /usr/src/event-listener

EXPOSE 5001

CMD npm start  