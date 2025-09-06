import { Hono } from "hono";
import { logger } from "hono/logger";
import { InfoLogger, RouteLogger } from "./utils/logger.js";
import { asciiHTML, separatorHTML } from "./utils/info.js";
import { ANIXART_HEADERS, appVersion, BASE_URLS } from "./config.js";
import { tryCatchAPI } from "./utils/tryCatch.js";
import { hookList, runHooks } from "./hooks/index.ts";

const app = new Hono({ strict: false });
app.use(logger(RouteLogger));

app.get("/", (c) => {
  return c.html(`
<!Doctype html>
<html lang="en" style="font-family: monospace; background-color: black; color: white;">
  <head></head>
  <body>
    <style>
      ul{list-style:none;padding-left:1rem;font-size:16px}
      p{font-size:14px}
      li::before{content:">";color:white;display:inline-block;width:1.25rem;margin-left:-1rem;margin-bottom:0.25rem;}
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
      p{font-size:14px;margin-bottom:-0.5rem;}
      a,a:visited{color:white;}
      a:hover{color:gray;}
    </style>
    ${asciiHTML()}
    ${separatorHTML()}
    <p id="status">Status: OK</p>
    <p>Version: ${appVersion}</p>
  </body>
</html>
`);
});

app.get("/health/json", (c) => {
  return c.json({ status: "OK", version: appVersion });
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
  if (
    url.searchParams.get("API-Version") == "v2" ||
    c.req.header("API-Version") == "v2"
  ) {
    ANIXART_HEADERS["Api-Version"] = "v2";
    url.searchParams.delete("API-Version");
  }

  InfoLogger("index.ts", "URL:", `${url.protocol}//${url.host}${url.pathname}`);
  const { data, error } = await tryCatchAPI(
    fetch(url.toString(), {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (error) {
    return c.json(error);
  }

  await runHooks(hookList, url, data);

  //@ts-ignore
  return c.json(data);
});

export default app;
