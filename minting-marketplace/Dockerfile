FROM node:16.13.0 as build

#install dependencies
WORKDIR /usr/src/minting
COPY package*.json ./
RUN npm install
COPY . /usr/src/minting
#RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

FROM node:16.13.0
WORKDIR /usr/src/minting
COPY --from=build /usr/src/minting /usr/src/minting

EXPOSE 3001

CMD npm start  