from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


@router.get("", summary="Get user favorites list")
async def GetUserFavorites(request: Request, token: str, page: int = 0):
    return await apiRequest(
        request, ENDPOINTS["user"]["favorite"], f"all/{page}", query=f"?token={token}"
    )


@router.get("/list/{release_id}/add", summary="Add release to user favorites")
async def addReleaseToFavorites(request: Request, release_id: int, token: str):
    return await apiRequest(
        request,
        ENDPOINTS["user"]["favorite"],
        f"add/{release_id}",
        query=f"?token={token}",
    )


@router.get("/list/{release_id}/delete", summary="Remove release from user favorites")
async def deleteReleaseFromFavorites(request: Request, release_id: int, token: str):
    return await apiRequest(
        request,
        ENDPOINTS["user"]["favorite"],
        f"delete/{release_id}",
        query=f"?token={token}",
    )
