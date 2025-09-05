import { Hono } from "hono";
import { logger } from "hono/logger";
import { RouteLogger } from "./utils/logger.js";
import { trimTrailingSlash } from "hono/trailing-slash";
import { asciiHTML, separatorHTML } from "./utils/info.js";
import { appVersion } from "./config.js";

const app = new Hono({ strict: true });
app.use(trimTrailingSlash());
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

export default app;
