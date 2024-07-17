#Copy OFAC banned addresses
FROM python:3.13-rc-bookworm AS ofac
COPY ofac-sanctioned-digital-currency-addresses/ ./
ADD https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml sdn_advanced.xml
RUN python3 generate-address-list.py ETH -f JSON

#Backend
FROM node:lts AS build
#version management
COPY VERSION /
#install dependencies
WORKDIR /usr/src/rairnode
COPY package.json ./
RUN npm install
COPY . /usr/src/rairnode
COPY --from=ofac sanctioned_addresses_ETH.json ./bin/integrations/ofac/sanctioned_addresses_ETH.json

EXPOSE 3000
EXPOSE 5000

CMD npm start