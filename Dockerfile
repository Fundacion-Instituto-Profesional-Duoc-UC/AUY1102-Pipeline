FROM node:20.20.0-alpine

COPY . .

WORKDIR /usr/src/app/

RUN npm version
