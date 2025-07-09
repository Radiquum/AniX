FROM node:23-alpine

LABEL org.opencontainers.image.source=https://github.com/radiquum/anix

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY *.ts ./

EXPOSE 7000

CMD ["npm", "run", "serve"]