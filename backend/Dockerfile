FROM node:16 
# set the working directory 
# of the container 
# path from the root dir 
WORKDIR /backend 

ENV PATH=/backend/node_modules/.bin:$PATH

COPY package.json .
RUN npm install
# copy the files 
COPY . .
# 
EXPOSE 8000
CMD npm start
