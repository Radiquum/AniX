FROM node:23-alpine

LABEL org.opencontainers.image.source=https://github.com/radiquum/anix

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY *.ts ./
COPY tsconfig.json ./

RUN mkdir -p /app/hooks

EXPOSE 7001
ENV PORT=7001
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "serve"]