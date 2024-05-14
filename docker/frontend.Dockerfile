FROM node:21-alpine

RUN mkdir /app
RUN mkdir /prepare

WORKDIR /prepare

ADD package.json .

RUN npm update -g npm --loglevel verbose
COPY . .
# RUN npm install --loglevel verbose
RUN npm ci --omit=dev --no-audit --maxsockets 1 --loglevel verbose
RUN npm run docker --loglevel verbose

RUN cp -a ./build/. /app/

WORKDIR /app
RUN rm -rf /prepare
RUN npm i sharp --loglevel verbose

CMD ["node", "./server.js"]
