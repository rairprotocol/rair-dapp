FROM node:latest as build

#version management
COPY VERSION /

#install dependencies
WORKDIR /usr/src/rairnode
COPY package*.json ./
RUN npm install
COPY . /usr/src/rairnode
#RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

FROM node:latest
WORKDIR /usr/src/rairnode
COPY --from=build /usr/src/rairnode /usr/src/rairnode

EXPOSE 3000
EXPOSE 5000

CMD npm start  