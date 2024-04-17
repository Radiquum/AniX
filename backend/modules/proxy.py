from typing import Union

import requests
from fastapi import Request

API_URL = "https://api.anixart.tv"
ENDPOINTS = {
    "release": f"{API_URL}/release",
    "profile": f"{API_URL}/profile",
    "filter": f"{API_URL}/filter",
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

    if request.method == "POST":
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
