import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from 'hono/cors'
import { InfoLogger, RouteLogger } from "./utils/logger.js";
import {
  asciiHTML,
  getRunningEnvironment,
  separatorHTML,
} from "./utils/info.js";
import { ANIXART_HEADERS, appVersion, BASE_URLS } from "./config.js";
import { tryCatchAPI } from "./utils/tryCatch.js";
import { hookList, runHooks } from "./hooks/index.js";

const app = new Hono({ strict: false });
app.use(logger(RouteLogger));
app.use('/*', cors({
  origin: (origin) => {
    return origin || "*"
  },
  allowMethods: ["GET", "HEAD", "POST", "OPTIONS"],
  allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Sign", "Allow", "User-Agent", "Api-Version"]
}))

app.get("/", (c) => {
  return c.html(`
<!Doctype html>
<html lang="en" style="font-family: monospace; background-color: black; color: white;">
  <head></head>
  <body>
    <style>
      ul{list-style:none;padding-left:1rem;font-size:16px}
      li::before{content:">";color:white;display:inline-block;width:1.25rem;margin-left:-1rem;margin-bottom:0.25rem;}
      p{font-size:14px}
      a,a:visited{color:white;}
      a:hover{color:gray;}
    </style>
    <script>
      window.onload = () => {deploy_url.textContent = window.location;}
    </script>
    ${asciiHTML()}
    ${separatorHTML()}
    <p>To get started, modify your apk to use <span id="deploy_url">unknown</span>[endpoint] or deploy the AniX web client</p>
    ${separatorHTML()}
    <ul>
      <li>Developer: <a href="https://wah.su/radiquum">Radiquum</a></li>
      <li>Repository: <a href="https://github.com/Radiquum/AniX">https://github.com/Radiquum/AniX</a></li>
    </ul>
  </body>
</html>
`);
});

app.get("/health", (c) => {
  return c.html(`
<!Doctype html>
<html lang="en" style="font-family: monospace; background-color: black; color: white;">
  <head></head>
  <body>
    <style>
      ul{list-style:none;padding-left:1rem;font-size:16px}
      li::before{content:">";color:white;display:inline-block;width:1.25rem;margin-left:-1rem;margin-bottom:0.25rem;}
      p{font-size:14px;margin-bottom:-0.5rem;}
    </style>
    ${asciiHTML()}
    ${separatorHTML()}
    <p id="status">Status: OK</p>
    <p>Request Time: ${new Date().toLocaleString("ru-RU")}</p>
    <p>Version: ${appVersion}</p>
    <p>Runner: ${getRunningEnvironment()}</p>
    <p>Enabled Hooks:</p>
    <ul>
      ${hookList.map((hook) => `<li>${hook.title}: ${hook.description}</li>`).join("")}
    </ul>
  </body>
</html>
`);
});

app.get("/health/json", (c) => {
  return c.json({
    status: "OK",
    time: new Date().getTime(),
    version: appVersion,
    runner: getRunningEnvironment(),
    enabledHooks: hookList.map((hook) => ({
      title: hook.title,
      description: hook.description,
    })),
  });
});

app.get("/favicon.ico", (c) => {
  return c.text("", 404);
});

app.get("/*", async (c) => {
  InfoLogger("index.ts", "Trying to proxy `GET` request");

  const url = new URL(c.req.url);
  const currentBaseURL = new URL(
    BASE_URLS[Math.floor(Math.random() * BASE_URLS.length)]
  );
  url.protocol = currentBaseURL.protocol;
  url.host = currentBaseURL.host;
  url.port = currentBaseURL.port;

  let headers = structuredClone(ANIXART_HEADERS);
  if (
    url.searchParams.get("API-Version") == "v2" ||
    c.req.header("API-Version") == "v2"
  ) {
    headers["Api-Version"] = "v2";
    url.searchParams.delete("API-Version");
  }

  InfoLogger("index.ts", "URL:", `${url.protocol}//${url.host}${url.pathname}`);
  const { data, error } = await tryCatchAPI(
    fetch(url.toString(), {
      method: "GET",
      headers: headers,
    })
  );

  if (error) {
    return c.json(error);
  }

  await runHooks(hookList, url, data, "GET");

  //@ts-ignore
  return c.json(data);
});

app.post("/*", async (c) => {
  InfoLogger("index.ts", "Trying to proxy `POST` request");

  const url = new URL(c.req.url);
  const currentBaseURL = new URL(
    BASE_URLS[Math.floor(Math.random() * BASE_URLS.length)]
  );
  url.protocol = currentBaseURL.protocol;
  url.host = currentBaseURL.host;
  url.port = currentBaseURL.port;

  let headers = structuredClone(ANIXART_HEADERS);
  if (
    url.searchParams.get("API-Version") == "v2" ||
    c.req.header("API-Version") == "v2"
  ) {
    headers["Api-Version"] = "v2";
    url.searchParams.delete("API-Version");
  }

  let reqContentType =
    c.req.header("content-type") ?
      c.req.header("content-type")?.split(";")[0].toLowerCase()
    : "application/json";

  InfoLogger("index.ts", "URL:", `${url.protocol}//${url.host}${url.pathname}`);
  InfoLogger("index.ts", "Content-Type:", `${reqContentType}`);

  let data = null;
  let error = null;

  switch (reqContentType) {
    case "multipart/form-data":
      ({ data, error } = await tryCatchAPI(
        fetch(url.toString(), {
          method: "POST",
          headers: headers,
          body: await c.req.formData(),
        })
      ));
      break;
    case "application/x-www-form-urlencoded":
      ({ data, error } = await tryCatchAPI(
        fetch(url.toString(), {
          method: "POST",
          headers: headers,
          body: null,
        })
      ));
      break;
    default:
      ({ data, error } = await tryCatchAPI(
        fetch(url.toString(), {
          method: "POST",
          headers: headers,
          body: JSON.stringify(await c.req.json()),
        })
      ));
      break;
  }

  if (error) {
    return c.json(error);
  }

  await runHooks(hookList, url, data, "POST");

  //@ts-ignore
  return c.json(data);
});

export default app;
