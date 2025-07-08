
# AniX - Api Proxy

This sub-project allows proxying requests to the Anixart API and modifying their responses using hooks.

It can be used both for the main AniX project and as a standalone service for the Android app with a modified API link.

License: [MIT](../LICENSE)

## Available Hooks

- release.ts: adds a rating from Shikimori to the additional info line
- profile.example.ts: changes the nickname of the official Anixart account (an example of using a hook)
- profile.sponsor.ts: enables sponsorship (disables ads) after logging into the account in the Android app
- toggles.ts: replaces the configuration response; if the `HOST_URL` environment variable is present, it replaces the web player link with an embedded one; when used together with the `PLAYER_PARSER_URL` variable, enables the custom web player, as in the AniX web client
- episode.disabled.ts: allows modifying/adding voiceovers, sources, and episodes using a JSON file in the `episode` folder.

## Usage

In the web browser address bar, enter:

`<http|https>://<ip|domain><:port>/<ENDPOINT>[?<QUERY_PARAMS>]`

Response:

- 500: an error occurred, see the `reason` field in the response body for more details
- 200: request was successful (if there was an error on the Anixart API side, see the `code` field)

## Deployment

### Docker

Requirements:

- [docker](https://docs.docker.com/engine/install/)

### Pre-built

1. Run the command:

`docker run -d --name anix-api -p 7001:7001 radiquum/anix-api-prox:latest`

To use hooks, create a `hooks` folder and add the flag `-v ./hooks:/app/hooks` before the `-p` flag.
(The same applies to the `episode` folder if needed)

### Manual Build

Additional Requirements:

- [git](https://git-scm.com/)

1. Clone the repository: `git clone https://github.com/Radiquum/AniX`
2. Navigate to the repository directory: `cd AniX`
3. Navigate to the service directory: `cd api-prox`
4. Run the command: `docker build -t anix-api-prox .`
5. After completion, run: `docker run -d --restart always --name anix-player -p 7001:7001 anix-api-prox`

To use hooks, add the flag `-v ./hooks:/app/hooks` before the `-p` flag.
(The same applies to the `episode` folder if needed)

### docker/Flags

- -d - run the container in background
- --restart always - always start after server reboot
- --name - container name
- -p - container port that will be accessible from outside. PORT:7000
- -v - mount a folder from host into the container

### docker/After Deployment

The service will be available at: `http://<YOUR IP><:YOUR PORT>/`

### docker/Note

To use your own domain and support HTTPS, you can use Traefik or another reverse proxy with an SSL certificate.

Useful links:

- [Converter from docker run command to docker compose syntax](https://it-tools.tech/docker-run-to-docker-compose-converter)
- [How to setup Traefik + custom domain + SSL](https://letmegooglethat.com/?q=how+to+setup+traefik+with+custom+domain+and+ssl+certificate+from+lets+encrypt%3F)

### pm2

Requirements:

- [git](https://git-scm.com/)
- [nodejs 23+ with npm](http://nodejs.org/)
- [pm2](https://pm2.keymetrics.io/)

Instructions:

1. Clone the repository: `git clone https://github.com/Radiquum/AniX`
2. Navigate to the repository directory: `cd AniX`
3. Navigate to the service directory: `cd api-prox`
4. Run: `npm install`
5. After completion, run: `pm2 start index.ts -n anix-api-prox`

### pm2/Flags

- -n - service name in pm2

### pm2/After Deployment

The service will be available at: `http://<YOUR IP>:7001/`

### pm2/Note

For automatic app startup, it is recommended to set up pm2 autostart using the command: `pm2 startup`

Useful links:

- [PM2: a smart approach to process management @ Habr](https://habr.com/ru/articles/480670/)
