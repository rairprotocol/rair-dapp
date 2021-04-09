FROM  node:latest
ENV NODE_ENV=production

RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm install pm2 -g 	
EXPOSE  3000
CMD ["pm2-runtime","./bin/www","-i","4", "--watch", "--name", "rair"]  