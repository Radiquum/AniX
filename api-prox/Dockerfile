FROM node:23-alpine

LABEL org.opencontainers.image.source=https://github.com/radiquum/anix

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ADD src ./src
COPY node.ts ./
COPY tsconfig.json ./

EXPOSE 7001

CMD ["npm", "run", "node-run"]