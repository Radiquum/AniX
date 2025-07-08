import { asJSON, randomUA } from "./shared";

export async function getSibnetURL(req, res, url: string) {

    if (!url.includes("sibnet")) {
        asJSON(req, res, { message: "Wrong url provided for player sibnet" }, 400);
        return
    }

    const user_agent = randomUA();

    let pageRes = await fetch(url, {
        headers: {
        "User-Agent": user_agent,
        },
    });
    if (!pageRes.ok) {
        asJSON(req, res, { message: `SIBNET:${pageRes.status}: failed to load page` }, 500)
        return
    }
    const pageData = await pageRes.text();
    const videoRe = /\/v\/.*?\.mp4/;
    const videoMatch = videoRe.exec(pageData);

    if (!videoMatch || videoMatch.length == 0) {
        asJSON(req, res, { message: `SIBNET: failed to find data to parse` }, 500)
        return
    }

    const posterRe = /\/upload\/cover\/.*?\.jpg/;
    const posterMatch = posterRe.exec(pageData);

    const actualVideoRes = await fetch(
        `https://video.sibnet.ru${videoMatch[0]}`,
        {
        headers: {
            "User-Agent": user_agent,
            Referer: url,
        },
        redirect: "manual",
        }
    );

    if (!actualVideoRes.headers.get("location")) {
        asJSON(req, res, { message: `SIBNET: failed to get video link` }, 500)
        return
    }

    const video = `https:${actualVideoRes.headers.get("location")}`;
    const poster =
        posterMatch ?
        posterMatch.length > 0 ?
            `https://st.sibnet.ru${posterMatch[0]}`
        : null
        : null;

    asJSON(req, res, { manifest: video, poster }, 200)
    return
}
