# AniX - Api Proxy

This sub-project allows proxying requests to the Anixart API and modifying their responses using hooks.

It can be used both for the main AniX project and as a standalone service for the Android app with a modified API link via [anixart-patcher](https://github.com/radiquum/anixart-patcher).

License: [MIT](./LICENSE)

## Structure

This project has the following structure

```md
.
├── src
│   ├── hooks
│   │   ├── index.ts - functions for running the hooks
│   │   ├── enabledHooks.ts - list of enabled hooks
│   │   ├── hook1.ts - hook file(s)
│   │   ├── ...
│   ├── json
│   │   └── file.json - json files to import in hook to use as a data storage
│   ├── utils
│   │   ├── info.ts - info functions for api-prox
│   │   ├── logger.ts - logger functions for api-prox
│   │   └── tryCatch.ts - tryCatch wrapper for async functions like fetch
│   ├── config.ts - config of api-prox
│   └── index.ts - entrypoint and route handling
├── .dockerignore
├── .gitignore
├── .vercelignore
├── bun.lock
├── bun.ts - file to run with bun
├── deno.json
├── deno.lock
├── deno.ts - file to run with deno
├── Dockerfile
├── LICENSE
├── node.ts - file to run with node
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── vercel.json
└── wrangler.jsonc
```

In coding of this project used a Hono framework to make it run on multiple serverless platforms

Tested with following platforms:

- CloudFlare Workers
- Vercel Functions
- Deno Deploy

## Usage

To access the main page enter the url of your deployed project: `<http|https>://<ip|domain><:port>/<ENDPOINT>[?<QUERY_PARAMS>]`

Available endpoints:

- `GET /` - main page, how to get started with your deploy
- `GET /health` - health page, version info and enabled hooks
- `GET /health/json` - same as before, but in json format
- `GET|POST /*` - proxy the pathname and query to anixart server

Response:

- 200: request to proxy was successful

if page is not found: returned a json with `{"message": <reason>, "code": 404}`

if API returned a non zero code: returned a json with `{"message": <reason>, "code": <code from api response>}`

## Hooks

Hooks are a functions with a matcher that modify the API response

Type:

```ts
export type Hook = {
  title: string;
  description: string | null;
  priority: number;
  match: (url: URL, method: "GET" | "POST") => boolean;
  hook: (url: URL, data: any, method: "GET" | "POST") => Promise<any>;
};
```

Title and Descriptions will be used to show an enabled hook at a `/health` endpoint

To view how to write a hook, you can see the build-in hooks as a reference:

- [addUserRoles.ts](./src/hooks/addUserRoles.ts)
- [show3rdPartyReleaseRating.ts](./src/hooks/show3rdPartyReleaseRating.ts)

To enable the hook, you need to import it inside [enabledHooks.ts](./src/hooks/enabledHooks.ts), and add it to `enabledHooks` list inside

## Deployment

### Cloud Platforms

1. Clone the repository

    ```sh
    git clone https://github.com/Radiquum/AniX.git
    ```

2. Install the dependencies

    For CloudFlare workers / Vercel functions

    ```sh
    npm install
    ```

    For Deno deploy

    ```sh
    deno install
    ```

3. If needed modify the config and hooks (same as in docker from step 6)

4. Deploy

    CloudFlare workers

    ```sh
    npm run cf-deploy
    ```

    Vercel functions

    ```sh
    npm run vc-deploy
    ```

    Deno deploy

    ```sh
    deno run deno-deploy
    ```

### Docker

Requirements:

- [docker engine](https://docs.docker.com/engine/install/)
- Linux based system or WSL

#### Pre-Build

1. Run the command:

```sh
docker run -d --restart always --name anix-api -p 7001:7001 radiquum/anix-api-prox:latest
```

#### Manual Build

Additional Requirements:

- [git](https://git-scm.com/)

1. Clone the repository: `git clone https://github.com/Radiquum/AniX`
2. Navigate to the repository directory: `cd AniX`
3. Navigate to the service directory: `cd api-prox`
4. Run the command: `docker build -t anix-api-prox .`
5. After completion, run: `docker run -d --restart always --name anix-api-prox -p 7001:7001 anix-api-prox`

#### How To use hooks

1. create a `hooks` folder and add the flag

    `-v ./hooks:/app/src/hooks/custom`

    before the `-p` flag.

2. do the same for json folder

    `-v ./json:/app/src/json/custom`

3. create a `enabledHooks.ts` file with the following content and link it to container with

    `-v ./enabledHooks.ts:/app/src/hooks/enabledHooks.ts`

    ``` ts
    import { Hook } from "./index.js";

    export const enabledHooks: Hook[] = [];
    export default enabledHooks;
    ```

    This will disable bundled hooks

4. Place your hooks to hooks directory at host

5. Place your json files to json directory at host

6. Import hook to enabledHooks.ts

    ```ts
    import MyHook from "./custom/MyHook.js"
    ```

    To import a json files inside a hook:

    ```ts
    import MyJson from "../json/custom/MyJson.json" with {"type": "json"};
    ```

7. Add your hook to list of enabled hooks inside `enabledHooks.ts`:

    ```ts
    ...
    export const enabledHooks: Hook[] = [MyHook];
    ...
    ```

8. Start or Restart the container

## Development

This project provides a multiple of development commands

Cloudflare workers:

```sh
npm run cf-dev
```

Vercel Functions:

```sh
npm run vc-dev
```

Bun

```sh
bun run bun-dev
```

Deno

```sh
deno run deno-dev
```

Node

```sh
npm run node-dev
```

## Issue report

To report a bug or a feature reques use the Issues tab of the main repository with the following title:

`API-PROX/<BUG|REQUEST>: <Your Title Here>`

## Contributing

We welcome any contributions to this project! If you have any bug fixes, improvements, or new features, please feel free to create a pull request or an issue.
