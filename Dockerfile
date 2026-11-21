FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./

ENV CI=true
RUN npm ci

COPY . .

RUN npm run build && chown -R node:node /usr/src/app

USER node

CMD ["npm", "run", "test:unit"]