FROM node:latest
ENV NODE_ENV=production
WORKDIR /usr/local/src/

#install IPFS
COPY ./go-ipfs .
RUN bash install.sh
RUN ipfs init --profile server

#install node
COPY . /usr/local/src

RUN apt update
RUN apt install -y ffmpeg
RUN npm install readdirp
RUN npm install
EXPOSE 5000
CMD npm start