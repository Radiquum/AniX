# Anix Backend

This is the backend for AniX, an unofficial WEB client for the Android app Anixart.

It is using FastAPI and server as a proxy between app API and Web Client.

## Deployment

### Environment variables

- API_PREFIX - sets the api prefix

### Docker

  [Refer the docker deployment from root README file](../README.md#docker-deployment)

## Vercel

1. fork the repository
2. create a new project on vercel and set the root directory to backend
3. (optionally) set API_PREFIX env variable
4. click deploy

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Radiquum/AniX/tree/main/backend)

*note*: this will create a new repository
