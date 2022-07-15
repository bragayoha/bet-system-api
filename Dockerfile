FROM node:16.15.1

WORKDIR /app

COPY package*.json ./

RUN npm i && npm i argon2

COPY . .

EXPOSE 3333

CMD ["npm","run","dev"]
