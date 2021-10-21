FROM node:14.18.1-alpine

WORKDIR /app

# RUN apk add g++ make python

COPY package.json .

RUN npm i npm@6.14.15 -g

COPY . .

EXPOSE 3000

RUN npm install

# RUN npm run build


CMD npm run server