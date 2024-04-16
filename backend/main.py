import requests
from fastapi import FastAPI
from fastapi import Request

app = FastAPI()

API_URL = "https://api.anixart.tv"
ENDPOINTS = {
    "release": f"{API_URL}/release",
    "profile": f"{API_URL}/profile",
}
USER_AGENT = "AnixartApp/8.2.1-23121216 (Android 11; SDK 30; arm64-v8a;)"


async def apiRequest(
    # noqa: E501
    request: Request = None,
    endpoint: str = "",
    path: str = "",
    query: str = "",
):

    headers = {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json; charset=UTF-8",
    }

    if request.method == "POST":
        r = requests.post(
            # noqa: E501
            f"{endpoint}/{path}{query}",
            headers=headers,
            data=await request.body(),
        )
    else:
        r = requests.get(f"{endpoint}/{path}{query}", headers=headers)

    if r.status_code != 200:
        return {"error": r.text}
    return r.json()


@app.get("/profile/{user_id}")
async def getUserById(request: Request, user_id: str, short: bool = False):
    res = await apiRequest(request, ENDPOINTS["profile"], user_id)
    if short is False:
        return res
    return {
        "code": res["code"],
        "profile": {
            "id": res["profile"]["id"],
            "login": res["profile"]["login"],
            "avatar": res["profile"]["avatar"],
        },
    }


@app.get("/release/{release_id}")
async def GetReleaseById(request: Request, release_id: str):
    return await apiRequest(request, ENDPOINTS["release"], release_id)
