FROM node:17.0-alpine

WORKDIR /app

# RUN apk add g++ make python

COPY package.json .

RUN npm i npm@latest -g

COPY . .

EXPOSE 3000

RUN npm install

# RUN npm run build


CMD npm run server