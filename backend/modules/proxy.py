from typing import TypedDict
from typing import Union

import requests
from fastapi import APIRouter
from fastapi import Request
from fastapi import Response


class Endpoints(TypedDict):
    release: dict[str, str]
    profile: str
    filter: str
    auth: str
    user: dict[str, str]
    search: str
    statistic: dict[str, str]


API_URL = "https://api.anixart.tv"
ENDPOINTS: Endpoints = {
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
        "favorite": f"{API_URL}/favorite",
    },
    "search": f"{API_URL}/search/releases",
    "statistic": {
        "addHistory": f"{API_URL}/history/add",
        "markWatched": f"{API_URL}/episode/watch",
    },
}
USER_AGENT = "AnixartApp/8.2.1-23121216 (Android 11; SDK 30; arm64-v8a;)"


async def apiRequest(
    request: Request = None,
    endpoint: Union[str, Endpoints] = "",
    path: Union[str, int] = "",
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


router = APIRouter()


@router.get(
    "/image",
    responses={200: {"content": {"image/jpg": {}, "image/png": {}}}},
    response_class=Response,
)
async def imageProxy(url: str):
    type = url.split(".")[-1]
    response: bytes = requests.get(url).content
    return Response(content=response, media_type=f"image/{type}")
