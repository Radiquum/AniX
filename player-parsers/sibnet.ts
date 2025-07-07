import { asJSON, randomUA } from "./shared";

export async function getSibnetURL(res, url: string) {

    if (!url.includes("sibnet")) {
        asJSON(res, { message: "Wrong url provided for player sibnet" }, 400);
        return
    }

    const user_agent = randomUA();

    let pageRes = await fetch(url, {
        headers: {
        "User-Agent": user_agent,
        },
    });
    if (!pageRes.ok) {
        asJSON(res, { message: `SIBNET:${pageRes.status}: failed to load page` }, 500)
        return
    }
    const pageData = await pageRes.text();
    const videoRe = /\/v\/.*?\.mp4/;
    const videoMatch = videoRe.exec(pageData);

    if (!videoMatch || videoMatch.length == 0) {
        asJSON(res, { message: `SIBNET: failed to find data to parse` }, 500)
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
        asJSON(res, { message: `SIBNET: failed to get video link` }, 500)
        return
    }

    const video = actualVideoRes.headers.get("location");
    const poster =
        posterMatch ?
        posterMatch.length > 0 ?
            `https://st.sibnet.ru${posterMatch[0]}`
        : null
        : null;

    asJSON(res, { manifest: video, poster }, 200)
    return
}
