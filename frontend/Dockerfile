FROM node:16 as build-stage 
WORKDIR /frontend

ENV PATH=/frontend/node_modules/.bin:$PATH

COPY package.json .
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "serve", "-s", "build" ]
# http connection is one-way 
# gotta create web-socket connection
# for 2 way connection