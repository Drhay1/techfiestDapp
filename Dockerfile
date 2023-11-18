FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -f

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/main.js"]