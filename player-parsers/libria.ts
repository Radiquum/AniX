import { asJSON } from "./shared";
const API_URL = "https://api.anilibria.tv/v3/title"

export async function getAnilibriaURL(res, url: string) {
  if (!url.includes("libria")) {
    asJSON(res, { message: "Wrong url provided for player libria" }, 400);
    return
  }

  const decodedUrl = new URL(url)

  const releaseId = decodedUrl.searchParams.get("id") || null
  const releaseEp = decodedUrl.searchParams.get("ep") || null

  let apiRes = await fetch(`${API_URL}?id=${releaseId}`);
  if (!apiRes.ok) {
    asJSON(res, { message: "LIBRIA: failed to get api response" }, 500);
    return
  }

  let data = stripResponse(await apiRes.json(), releaseEp);

  if (releaseEp) {
    data["manifest"] = createManifest(data, releaseEp)
    data["poster"] = getPoster(data, releaseEp)
  }


  asJSON(res, data, 200);
  return
}

function stripResponse(data, releaseEp) {
  const resp = {}
  resp["posters"] = data.posters

  resp["player"] = {}
  resp["player"]["host"] = data.player.host
  resp["player"]["list"] = data.player.list

  if (releaseEp) {
    resp["player"]["list"] = {}
    resp["player"]["list"][releaseEp] = data.player.list[releaseEp]
  }

  return resp
}

function createManifest(data, releaseEp) {
  const resolutions = {
    sd: "854x480",
    hd: "1280x720",
    fhd: "1920x1080",
  };

  const stringBuilder: string[] = [];

  stringBuilder.push("#EXTM3U");
  for (const [key, value] of Object.entries(data.player.list[releaseEp].hls).reverse()) {
    if (!value) continue
    stringBuilder.push(`#EXT-X-STREAM-INF:RESOLUTION=${resolutions[key]}`);
    stringBuilder.push(`https://${data.player.host}${value}`);
  }

  return stringBuilder.join("\n");
}

function getPoster(data, releaseEp) {
  if (data.player.list[releaseEp].preview) return `https://anixart.libria.fun${data.player.list[releaseEp].preview}`
  if (data.posters.medium.raw_base64_file) return data.posters.medium.url
  return `https://anilibria.top${data.posters.medium.url}`
}