FROM node:18

WORKDIR /usr/src/main

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "src/main.js" ]
