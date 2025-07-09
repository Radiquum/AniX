import {
  ANIXART_API,
  ANIXART_HEADERS,
  ANIXART_HEADERST,
  asJSON,
  GetHook,
  logger,
  PostHook,
} from "./shared";
import express from "express";
import fs from "fs/promises";
import { MediaChromeTheme } from "./media-chrome";
import { Iframe } from "./iframe";

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Sign"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
  next();
});
app.use(
  express.raw({ inflate: true, limit: "50mb", type: "multipart/form-data" })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const HOST = process.env.HOST || "0.0.0.0";
const PORT = 7001;

let hooks: string[] = [];

async function loadHooks() {
  let hooksDir: string[] = [];
  try {
    hooksDir = await fs.readdir("./hooks");
  } catch (err) {
    logger.error("'hooks' directory not found");
  }

  for (let i = 0; i < hooksDir.length; i++) {
    const name = hooksDir[i];
    if (
      !name.endsWith(".ts") ||
      name.includes("example") ||
      name.includes("disabled")
    )
      continue;

    require(`./hooks/${name}`);
    logger.infoHook(`Loaded "./hooks/${name}"`);
    hooks.push(name);

    (async () => {
      try {
        const watcher = fs.watch(`./hooks/${name}`);
        for await (const event of watcher) {
          if (event.eventType === "change") {
            logger.infoHook(`Updated "./hooks/${event.filename}"`);
            delete require.cache[require.resolve(`./hooks/${event.filename}`)];
            require(`./hooks/${event.filename}`);
          }
        }
      } catch (err) {
        throw err;
      }
    })();
  }
}

app.get("/player", async (req, res) => {
  let url = req.query.url || null;

  res.status(200);
  res.set({
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Cache-Control": "no-cache",
    "Content-Type": "text/html; charset=utf-8",
  });
  if (!url) {
    res.send("<h1>No url query found!</h1>");
    return;
  }

  let player = "";
  let poster = "";

  const CUSTOM_PLAYER_DOMAINS = [
    "video.sibnet.ru",
    "anixart.libria.fun",
    "kodik.info",
    "aniqit.com",
    "kodik.cc",
    "kodik.biz",
  ];
  const urlDomain = new URL(url.toString());
  const PLAYER_PARSER_URL = process.env.PLAYER_PARSER_URL || null;

  if (CUSTOM_PLAYER_DOMAINS.includes(urlDomain.hostname)) {
    try {
      if (!PLAYER_PARSER_URL) throw new Error();

      if (
        ["kodik.info", "aniqit.com", "kodik.cc", "kodik.biz"].includes(
          urlDomain.hostname
        )
      ) {
        player = "kodik";
      }
      if ("anixart.libria.fun" == urlDomain.hostname) {
        player = "libria";
      }
      if ("video.sibnet.ru" == urlDomain.hostname) {
        player = "sibnet";
      }

      const playerParserRes = await fetch(
        `${PLAYER_PARSER_URL}?url=${encodeURIComponent(url.toString())}&player=${player}`
      );

      if (!playerParserRes.ok) throw new Error();

      const playerParserData: { manifest: string; poster: string } =
        await playerParserRes.json();

      poster = playerParserData.poster;
      if (playerParserData.manifest.startsWith("#EXTM3U")) {
        const playerUrlArray = playerParserData.manifest.split("\n");
        url = playerUrlArray.join("\\n");
      } else {
        url = playerParserData.manifest;
      }
    } catch {
      res.send(Iframe(url.toString()));
      return;
    }
  } else if (url.toString().toLowerCase().endsWith("mp4")) {
    player = "mp4";
  } else if (url.toString().toLowerCase().endsWith(".m3u8")) {
    player = "hls";
  } else {
    res.send(Iframe(url.toString()));
    return;
  }

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Веб-плеер</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes' />
        <style>body, html {height: 100%; width: 100%; margin: 0px;padding: 0px;border: 0px;}</style>
        ${["kodik", "libria", "hls"].includes(player) ? '<script type="module" src="https://cdn.jsdelivr.net/npm/hls-video-element@1.2/+esm"></script>' : ""}
        <script>
          window.onload = () => {
            const url = "${url}";
            const poster = "${poster}";
            const element = document.querySelector("#video-element");

            element.poster = poster;
            if (url.startsWith("http")) {
              element.src = url;
            } else {
              let file = new File([url], "manifest.m3u8", {
                type: "application/x-mpegURL",
              });
              element.src = URL.createObjectURL(file);
            };
          };
        </script>
      </head>
      <body>

      ${MediaChromeTheme()}

      <media-theme
        template="media-theme-sutro"
        style="width:100%;height:100%;">
          ${
            ["kodik", "libria", "hls"].includes(player) ?
              `<hls-video slot="media" playsinline id="video-element"></hls-video>`
            : `<video slot="media" playsinline id="video-element"></video>`
          }
        </media-theme>
      </body>
    </html>
    `);
});

app.get("/*path", async (req, res) => {
  if (req.path == "/favicon.ico") return asJSON(req, res, {}, 404);

  const url = new URL(`${ANIXART_API}${req.url}`);
  logger.debug(
    `[${req.method}] ${url.protocol}//${url.hostname}${url.pathname}`
  );
  // logger.debug(`  ↳ [QUERY] ${url.searchParams.toString()}`);

  if (
    url.searchParams.get("API-Version") == "v2" ||
    req.headers["api-version"] == "v2"
  ) {
    // logger.debug(`  ↳ Force API V2`);
    ANIXART_HEADERS["Api-Version"] = "v2";
    url.searchParams.delete("API-Version");
  }

  const apiResponse = await fetch(url.toString(), {
    method: "GET",
    headers: ANIXART_HEADERS,
  });

  if (
    !apiResponse ||
    !apiResponse.ok ||
    apiResponse.headers.get("content-type") != "application/json"
  ) {
    logger.error(
      `Failed to fetch: '${url.protocol}//${url.hostname}${url.pathname}', Path probably doesn't exist`
    );
    asJSON(
      req,
      res,
      {
        code: 99,
        returned_value: {
          request_status: apiResponse ? apiResponse.status : null,
          request_content_type:
            apiResponse ? apiResponse.headers.get("content-type") : null,
        },
        reason: "Path probably doesn't exist",
      },
      500
    );
    return;
  }

  let data = await apiResponse.json();
  for (let i = 0; i < hooks.length; i++) {
    const name = hooks[i];
    const hook: GetHook = require(`./hooks/${name}`);
    if (!hook.hasOwnProperty("match") || !hook.hasOwnProperty("get")) continue;
    if (!hook.match(req.path)) continue;
    data = await hook.get(data, url);
  }

  asJSON(req, res, data, 200);
  return;
});

app.post("/*path", async (req, res) => {
  const url = new URL(`${ANIXART_API}${req.url}`);
  logger.debug(
    `[${req.method}] ${url.protocol}//${url.hostname}${url.pathname}`
  );
  // logger.debug(`  ↳ [QUERY] ${url.searchParams.toString()}`);

  let reqContentType =
    req.headers["content-type"] ?
      req.headers["content-type"].split(";")[0]
    : "x-unknown/unknown";

  const supportedContentTypes = [
    "application/json",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
  ];

  const isSupported = supportedContentTypes.includes(
    reqContentType.toLowerCase()
  );

  if (!isSupported) {
    res.status(500).json({
      code: 99,
      error: "Unsupported Media Type",
      reason: `Content-Type '${reqContentType}' is not supported.`,
    });
    return;
  }

  let apiResponse: null | Response = null;
  const apiHeaders: ANIXART_HEADERST = {
    "User-Agent": ANIXART_HEADERS["User-Agent"],
    "Content-Type": req.headers["content-type"] || "application/json"
  };

  if (
    url.searchParams.get("API-Version") == "v2" ||
    req.headers["api-version"] == "v2"
  ) {
    // logger.debug(`  ↳ Force API V2`);
    apiHeaders["Api-Version"] = "v2";
    url.searchParams.delete("API-Version");
  }

  switch (reqContentType) {
    case "multipart/form-data":
      apiResponse = await fetch(url.toString(), {
        method: "POST",
        headers: apiHeaders,
        body: req.body,
      });
      break;
    case "application/x-www-form-urlencoded":
      apiResponse = await fetch(url.toString(), {
        method: "POST",
        headers: apiHeaders,
        body: new URLSearchParams(req.body),
      });
      break;
    case "application/json":
      apiResponse = await fetch(url.toString(), {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(req.body),
      });
      break;
  }

  if (
    !apiResponse ||
    !apiResponse.ok ||
    apiResponse.headers.get("content-type") != "application/json"
  ) {
    logger.error(
      `Failed to post: '${url.protocol}//${url.hostname}${url.pathname}', Path probably doesn't exist`
    );
    asJSON(
      req,
      res,
      {
        code: 99,
        returned_value: {
          request_status: apiResponse ? apiResponse.status : null,
          request_content_type:
            apiResponse ? apiResponse.headers.get("content-type") : null,
        },
        reason: "Path probably doesn't exist",
      },
      500
    );
    return;
  }

  let data = await apiResponse.json();
  for (let i = 0; i < hooks.length; i++) {
    const name = hooks[i];
    const hook: PostHook = require(`./hooks/${name}`);
    if (!hook.hasOwnProperty("match") || !hook.hasOwnProperty("post")) continue;
    if (!hook.match(req.path)) continue;
    data = await hook.post(data, url);
  }

  asJSON(req, res, data, 200);
  return;
});

app.listen(PORT, HOST, function () {
  loadHooks();
  logger.info(`Server listen: http://${HOST}:${PORT}`);
});
