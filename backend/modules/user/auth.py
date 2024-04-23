import requests
from fastapi import APIRouter
from modules.proxy import ENDPOINTS
from modules.proxy import USER_AGENT
from pydantic import BaseModel


class User(BaseModel):
    email: str
    password: str


router = APIRouter()


@router.post("", summary="logging in")
async def userSignIn(
    user: User,
    short: bool = False,
):
    headers = {
        "User-Agent": USER_AGENT,
        "Sign": "9aa5c7af74e8cd70c86f7f9587bde23d",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    r = requests.post(
        # noqa: E501
        f"{ENDPOINTS['auth']}",
        headers=headers,
        data={"login": user.email, "password": user.password},
    )
    if r.status_code != 200:
        return {"error": r.text}
    res = r.json()
    if short is True:
        return {
            "code": res["code"],
            "profile": {
                "id": res["profile"]["id"],
                "login": res["profile"]["login"],
                "avatar": res["profile"]["avatar"],
            },
            "profileToken": {
                "id": res["profileToken"]["id"],
                "token": res["profileToken"]["token"],
            },
        }
    return res
