FROM node:18-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

#RUN npm install --save-dev @types/react @types/react-dom

COPY . .

EXPOSE 3000

