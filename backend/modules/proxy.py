from typing import Union

import requests
from fastapi import Request

API_URL = "https://api.anixart.tv"
ENDPOINTS = {
    "release": {
        "info": f"{API_URL}/release",
        "episode": f"{API_URL}/episode",
    },
    "profile": f"{API_URL}/profile",
    "filter": f"{API_URL}/filter",
    "auth": f"{API_URL}/auth/signIn",
    "user": {
        "history": f"{API_URL}/history",
        "watching": f"{API_URL}/profile/list/all/1",
        "planned": f"{API_URL}/profile/list/all/2",
        "watched": f"{API_URL}/profile/list/all/3",
        "delayed": f"{API_URL}/profile/list/all/4",
        "abandoned": f"{API_URL}/profile/list/all/5",
    },
    "search": f"{API_URL}/search/releases",
    "statistic": {
        "addHistory": f"{API_URL}/history/add",
        "markWatched": f"{API_URL}/episode/watch",
    },
}
USER_AGENT = "AnixartApp/8.2.1-23121216 (Android 11; SDK 30; arm64-v8a;)"


async def apiRequest(
    # noqa: E501
    request: Request = None,
    endpoint: str = "",
    path: str = "",
    query: str = "",
    data: Union[None, str, dict] = None,
):

    headers = {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json; charset=UTF-8",
    }

    if data is not None or request.method == "POST":
        r = requests.post(
            # noqa: E501
            f"{endpoint}/{path}{query}",
            headers=headers,
            data=data,
        )
    else:
        r = requests.get(f"{endpoint}/{path}{query}", headers=headers)

    if r.status_code != 200:
        return {"error": r.text}
    return r.json()
