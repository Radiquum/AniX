import { asJSON, randomUA } from "./shared";
const altDomains = ["kodik.info", "aniqit.com", "kodik.cc", "kodik.biz"];

export async function getKodikURL(req, res, url: string) {
  const origDomain = url.replace("https://", "").split("/")[0];
  let domain = url.replace("https://", "").split("/")[0];

  if (!altDomains.includes(domain)) {
    asJSON(req, res, { message: "KODIK: Неправильная ссылка на плеер" }, 400);
    return;
  }

  let user_agent = randomUA();

  let pageRes = await fetch(url, {
    headers: {
      "User-Agent": user_agent,
    },
  });

  if (!pageRes.ok) {
    for (let i = 0; i < altDomains.length; i++) {
      if (url.includes(altDomains[i])) {
        continue;
      }

      user_agent = randomUA();
      const altDomain = altDomains[i];
      const altUrl = url.replace(
        `https://${origDomain}/`,
        `https://${altDomain}/`
      );

      domain = altDomain;
      pageRes = await fetch(altUrl, {
        headers: {
          "User-Agent": user_agent,
        },
      });

      if (pageRes.ok) {
        break;
      }
    }
  }

  if (!pageRes.ok) {
    asJSON(req, res, { message: "KODIK: Не удалось загрузить страницу с плеером" }, 500);
    return;
  }

  const pageData = await pageRes.text();
  const urlParamsRe = /var urlParams = .*;$/m;
  const urlParamsMatch = urlParamsRe.exec(pageData);

  if (!urlParamsMatch || urlParamsMatch.length == 0) {
    asJSON(req, res, { message: `KODIK: Не удалось найти данные эпизода` }, 500);
    return;
  }

  const urlParamsStr = urlParamsMatch[0]
    .replace("var urlParams = '", "")
    .replace("';", "");

  const urlStr = url.replace(`https://${origDomain}/`, "");
  const type = urlStr.split("/")[0];
  const id = urlStr.split("/")[1];
  const hash = urlStr.split("/")[2];

  const urlParams = JSON.parse(urlParamsStr);
  urlParams["type"] = type;
  urlParams["id"] = id;
  urlParams["hash"] = hash;

  const formData = new FormData();
  for (const [key, value] of Object.entries(urlParams)) {
    formData.append(key, value as any);
  }

  const linksRes = await fetch(`https://${domain}/ftor`, {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent": user_agent,
    },
  });

  if (!linksRes.ok) {
    asJSON(req, res, { message: `KODIK: Не удалось получить прямую ссылку` }, 500);
    return;
  }

  let data = stripResponse(await linksRes.json());
  if (isEncrypted(data)) {
    for (const [key] of Object.entries(data.links)) {
      data.links[key][0].src = decryptSrc(data.links[key][0].src);
    }
  }

  if (!hasProto(data)) {
    for (const [key] of Object.entries(data.links)) {
      data.links[key][0].src = addProto(data.links[key][0].src);
    }
  }

  if (!isAnimeTvSeries(data)) {
    data["manifest"] = data.links[data.default][0].src.replace(
      `${data.default}.mp4:hls:`,
      ""
    );
  } else {
    data["manifest"] = createManifest(data);
  }

  data["poster"] = data.links[data.default][0].src.replace(
    `${data.default}.mp4:hls:manifest.m3u8`,
    "thumb001.jpg"
  );

  asJSON(req, res, data, 200);
  return;
}

function stripResponse(data) {
  return {
    default: data.default,
    links: data.links,
  };
}

function isEncrypted(data) {
  return !data.links[data.default][0].src.includes("//");
}

function decryptSrc(enc: string) {
  const decryptedBase64 = enc.replace(/[a-zA-Z]/g, (e: any) => {
    return String.fromCharCode(
      (e <= "Z" ? 90 : 122) >= (e = e.charCodeAt(0) + 18) ? e : e - 26
    );
  });
  return atob(decryptedBase64);
}

function hasProto(data) {
  return data.links[data.default][0].src.startsWith("http");
}

function addProto(string) {
  return `https:${string}`;
}

function isAnimeTvSeries(data) {
  return (
    data.links[data.default][0].src.includes("animetvseries") ||
    data.links[data.default][0].src.includes("tvseries")
  );
}

function createManifest(data) {
  const resolutions = {
    240: "427x240",
    360: "578x360",
    480: "854x480",
    720: "1280x720",
    1080: "1920x1080",
  };

  const stringBuilder: string[] = [];

  stringBuilder.push("#EXTM3U");
  for (const [key] of Object.entries(data.links)) {
    stringBuilder.push(`#EXT-X-STREAM-INF:RESOLUTION=${resolutions[key]}`);
    stringBuilder.push(data.links[key][0].src);
  }

  return stringBuilder.join("\n");
}
