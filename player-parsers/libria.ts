import { asJSON } from "./shared";

export interface APIStatusResponse {
  request: Request;
  is_alive: boolean;
  available_api_endpoints: string[];
}

export interface Request {
  ip: string;
  country: string;
  iso_code: string;
  timezone: string;
}

async function checkApiStatus(req, res) {
  const endpoints = ["https://anilibria.top", "https://anilibria.wtf"];
  let selectedEndpoint: string | null = null;

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const apiRes = await fetch(`${endpoint}/api/v1/app/status`, {
      signal: AbortSignal.timeout(3000),
    });
    if (apiRes.ok) {
      const data: APIStatusResponse = await apiRes.json();
      if (data.is_alive != true) {
        asJSON(req, res, { message: "LIBRIA: API сервер не доступен" }, 500);
        return null;
      }
      selectedEndpoint = endpoint;
      break;
    }
  }

  if (!selectedEndpoint) {
    asJSON(req, res, { message: "LIBRIA: Нет доступных эндпоинтов API" }, 500);
    return null;
  }

  return selectedEndpoint;
}

export async function getAnilibriaURL(req, res, url: string) {
  if (!url.includes("libria")) {
    asJSON(req, res, { message: "LIBRIA: Неправильная ссылка на плеер" }, 400);
    return;
  }

  const apiEndpoint = await checkApiStatus(req, res);
  if (!apiEndpoint) {
    return;
  }

  const decodedUrl = new URL(url);

  const releaseId = decodedUrl.searchParams.get("id") || null;
  const releaseEp = decodedUrl.searchParams.get("ep") || null;

  let apiRes = await fetch(`${apiEndpoint}/api/v1/anime/releases/${releaseId}`);
  if (!apiRes.ok) {
    if (apiRes.status == 404) {
      asJSON(req, res, { message: "LIBRIA: Релиз не найден" }, 404);
      return;
    }

    asJSON(
      req,
      res,
      { message: "LIBRIA: Ошибка получения ответа от API" },
      500
    );
    return;
  }

  let data = stripResponse(req, res, await apiRes.json(), releaseEp);
  if (!data) {
    return;
  }

  if (releaseEp) {
    data["manifest"] = createManifest(data);
    data["poster"] = getPoster(data);
  }

  asJSON(req, res, data, 200);
  return;
}

function stripResponse(req, res, data, releaseEp) {
  const resp = {};
  resp["posters"] = data.poster;
  resp["episodes"] = data.episodes;

  if (releaseEp) {
    const episode = data.episodes.find((item) => item.ordinal == releaseEp);
    if (!episode) {
      asJSON(req, res, { message: "LIBRIA: Эпизод не найден" }, 404);
      return null;
    }
    resp["episodes"] = [episode];
  }

  return resp;
}

function createManifest(data) {
  const episode = data.episodes[0];
  const resolutions = {
    hls_480: "854x480",
    hls_720: "1280x720",
    hls_1080: "1920x1080",
  };

  const stringBuilder: string[] = [];

  stringBuilder.push("#EXTM3U");
  for (const [key, value] of Object.entries(resolutions)) {
    if (!episode[key]) continue;
    stringBuilder.push(`#EXT-X-STREAM-INF:RESOLUTION=${value}`);
    const url = new URL(episode[key]);
    url.search = "";
    stringBuilder.push(url.toString());
  }

  return stringBuilder.join("\n");
}

function getPoster(data) {
  const episode = data.episodes[0];

  if (episode.preview && episode.preview.preview)
    return `https://anixart.libria.fun${episode.preview.preview}`;
  return `https://anilibria.top${data.poster.preview}`;
}
