import { asJSON } from "./shared";
import { getAnilibriaURL } from "./libria";
import { getSibnetURL } from "./sibnet";
import { getKodikURL } from "./kodik";

import express from "express";
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Allow, User-Agent"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
  next();
});

const HOST = process.env.HOST || "0.0.0.0";
const PORT = 7000;
const allowedPlayers = ["kodik", "libria", "sibnet"];

app.get("/", (req, res) => {
  const urlParams = new URLSearchParams(req.query);
  const url = urlParams.get("url");
  const player = urlParams.get("player");

  if (!url) {
    asJSON(req, res, { message: "no 'url' query provided" }, 400);
    return;
  }

  if (!player) {
    asJSON(req, res, { message: "no 'player' query provided" }, 400);
    return;
  }

  switch (player) {
    case "libria":
      getAnilibriaURL(req, res, url);
      return;
    case "sibnet":
      getSibnetURL(req, res, url);
      return;
    case "kodik":
      getKodikURL(req, res, url);
      return;
    default:
      asJSON(
        req,
        res,
        {
          message: `player '${player}' is not supported. choose one of: ${allowedPlayers.join(", ")}`,
        },
        400
      );
      return;
  }
});

app.listen(PORT, HOST, function () {
  console.log(`Server listens http://${HOST}:${PORT}`);
});
