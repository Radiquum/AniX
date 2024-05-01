from typing import Union

from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


@router.get("/{user_id}", summary="Get user profile by user ID")
async def getUserById(
    request: Request, user_id: str, short: bool = False, token: Union[None, str] = None
):
    query = ""
    if token:
        query = f"?token={token}"

    res = await apiRequest(request, ENDPOINTS["profile"], user_id, query=query)
    if short is False:
        return res
    return {
        "code": res["code"],
        "profile": {
            "id": res["profile"]["id"],
            "login": res["profile"]["login"],
            "avatar": res["profile"]["avatar"],
        },
        "is_my_profile": res["is_my_profile"],
    }
