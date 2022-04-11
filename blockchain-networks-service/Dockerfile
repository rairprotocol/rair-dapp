FROM node:lateset

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . /usr/src/app


EXPOSE 5001

CMD npm start