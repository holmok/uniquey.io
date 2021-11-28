FROM node:16-slim

RUN  apt-get update && apt-get install -y git 

RUN yarn global add lerna

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY lerna.json ./
COPY tsconfig.json ./

RUN yarn install 

RUN mkdir -p /usr/src/app/packges/common
COPY ./packages/common/package.json ./packages/common/

RUN mkdir -p /usr/src/app/packges/api
COPY ./packages/api/package.json ./packages/api/
COPY ./packages/api/yarn.lock ./packages/api/

RUN lerna bootstrap

COPY ./packages/common ./packages/common
COPY ./packages/api ./packages/api

RUN lerna run build

RUN npm prune --production

EXPOSE 8081

CMD ["yarn", "start"]