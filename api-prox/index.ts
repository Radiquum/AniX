import { ANIXART_API, ANIXART_HEADERS, asJSON, logger } from "./shared";
import express from "express";
import fs from "fs/promises";

const app = express();
const host = "0.0.0.0";
const port = 7001;

const loadedHooks = [];

app.get("/*path", async (req, res) => {
  const url = new URL(`${ANIXART_API}${req.url}`);
  logger.debug(`Fetching ${url.protocol}//${url.hostname}${url.pathname}`);

  const isApiV2 = url.searchParams.get("API-Version") == "v2" || false;
  if (isApiV2) {
    logger.debug(`  ↳ Force API V2`);
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
    logger.error(`Failed to fetch: ${url.protocol}//${url.hostname}${url.pathname}`)
    asJSON(
      res,
      {
        code: 99,
        returned_value: {
          request_status: apiResponse.status,
          request_content_type: apiResponse.headers.get("content-type"),
        },
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

app.listen(port, host, function () {
  logger.info(`Server listen: http://${host}:${port}`);
});
