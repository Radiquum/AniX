import { ANIXART_API, ANIXART_HEADERS, asJSON, logger } from "./shared";
import express from "express";
import fs from "fs/promises";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const host = "0.0.0.0";
const port = 7001;

const loadedHooks = [];

app.get("/*path", async (req, res) => {
  if (req.path == "/favicon.ico") return asJSON(res, {}, 404);

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
    ANIXART_HEADERS["API-Version"] = "v2";
    url.searchParams.delete("API-Version");
  }

  const apiResponse = await fetch(url.toString(), {
    method: "GET",
    headers: ANIXART_HEADERS,
  });

  if (
    !apiResponse.ok ||
    apiResponse.headers.get("content-type") != "application/json"
  ) {
    logger.error(
      `Failed to fetch: '${url.protocol}//${url.hostname}${url.pathname}', Path probably doesn't exist`
    );
    asJSON(
      res,
      {
        code: 99,
        returned_value: {
          request_status: apiResponse.status,
          request_content_type: apiResponse.headers.get("content-type"),
        },
        reason: "Path probably doesn't exist",
      },
      500
    );
    return;
  }

  let data = await apiResponse.json();
  let hooks = [];

  try {
    hooks = await fs.readdir("./hooks");
  } catch (err) {
    logger.error("'hooks' directory not found");
  }

  for (let i = 0; i < hooks.length; i++) {
    const name = hooks[i];
    if (!name.endsWith(".ts")) continue;
    if (name.includes("example")) continue;

    const isHookLoaded = loadedHooks.find(
      (item) => item.path == `./hooks/${name}`
    );
    const stat = await fs.stat(`./hooks/${name}`);

    if (isHookLoaded && isHookLoaded.mtime != stat.mtime.toISOString()) {
      logger.infoHook(`Updated "./hooks/${name}"`);
      delete require.cache[require.resolve(`./hooks/${name}`)];
      isHookLoaded.mtime = stat.mtime.toISOString();
    }

    const hook = require(`./hooks/${name}`);
    if (!isHookLoaded) {
      logger.infoHook(`Loaded "./hooks/${name}"`);
      loadedHooks.push({
        path: `./hooks/${name}`,
        mtime: stat.mtime.toISOString(),
      });
    }

    if (!hook.hasOwnProperty("match") || !hook.hasOwnProperty("get")) continue;
    if (!hook.match(req.path)) continue;

    data = await hook.get(data, url);
  }

  asJSON(res, data, 200);
  return;
});

app.post("/*path", async (req, res) => {
  const url = new URL(`${ANIXART_API}${req.url}`);
  logger.debug(
    `[${req.method}] ${url.protocol}//${url.hostname}${url.pathname}`
  );
  // logger.debug(`  ↳ [QUERY] ${url.searchParams.toString()}`);

  let apiResponse: null | Response = null;
  const apiHeaders = {
    "User-Agent": ANIXART_HEADERS["User-Agent"],
    "Content-Type": req.headers["content-type"],
  };

  if (
    url.searchParams.get("API-Version") == "v2" ||
    req.headers["api-version"] == "v2"
  ) {
    // logger.debug(`  ↳ Force API V2`);
    apiHeaders["API-Version"] = "v2";
    url.searchParams.delete("API-Version");
  }

  const reqContentType =
    req.headers["content-type"] ?
      req.headers["content-type"].split(";")[0]
    : "application/json";
  switch (reqContentType) {
    case "multipart/form-data":
      const formData = new FormData();
      for (const name in req.body) {
        formData.append(name, req.body[name]);
      }
      apiResponse = await fetch(url.toString(), {
        method: "POST",
        headers: apiHeaders,
        body: formData,
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

  // logger.console("debug", `      ↳ [REQ BODY]`, req.body);
  // logger.console("debug", `      ↳ [REQ HEADERS]`, req.headers);
  // logger.console("debug", "      ↳ [RES TEXT]", await apiResponse.text());
  // logger.console("debug", "      ↳ [RES HEADERS]", apiResponse.headers);

  if (
    !apiResponse.ok ||
    apiResponse.headers.get("content-type") != "application/json"
  ) {
    logger.error(
      `Failed to post: '${url.protocol}//${url.hostname}${url.pathname}', Path probably doesn't exist`
    );
    asJSON(
      res,
      {
        code: 99,
        returned_value: {
          request_status: apiResponse.status,
          request_content_type: apiResponse.headers.get("content-type"),
        },
        reason: "Path probably doesn't exist",
      },
      500
    );
    return;
  }
  let data = await apiResponse.json();

  asJSON(res, data, 200);
  return;
});

app.listen(port, host, function () {
  logger.info(`Server listen: http://${host}:${port}`);
});
