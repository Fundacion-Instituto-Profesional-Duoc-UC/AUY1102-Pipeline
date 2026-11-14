#Docker
FROM node:14-alpine3.16

COPY . .

WORKDIR /usr/src/app/

RUN npm version
