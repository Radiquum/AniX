FROM node:21-alpine

WORKDIR /app

ADD package.json .

RUN npm update -g npm --loglevel verbose
COPY . .
RUN npm install --loglevel verbose
# RUN npm ci --no-audit --maxsockets 1

CMD ["npm", "run", "dev"]
