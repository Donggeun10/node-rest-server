FROM node:20.17.0-alpine3.20
LABEL authors="leedg17"

WORKDIR /app

COPY package*.json ./

RUN npm install

# converted the javascript source code files into the dist folder via typescript files and copy resources to the dist folder
COPY dist /app/dist

ENTRYPOINT ["npm", "run", "start"]