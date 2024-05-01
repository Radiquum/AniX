from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


@router.get("/history", summary="Get user watch history")
async def GetUserHistory(request: Request, token: str, page: int = 0):
    return await apiRequest(
        request, ENDPOINTS["user"]["history"], page, query=f"?token={token}"
    )


@router.get("/watching", summary="Get user watch list")
async def GetUserWatching(request: Request, token: str, page: int = 0):
    return await apiRequest(
        request, ENDPOINTS["user"]["watching"], page, query=f"?token={token}"
    )


@router.get("/planned", summary="Get user planned list")
async def GetUserPlanned(request: Request, token: str, page: int = 0):
    return await apiRequest(
        request, ENDPOINTS["user"]["planned"], page, query=f"?token={token}"
    )


@router.get("/watched", summary="Get user watched list")
async def GetUserWatched(request: Request, token: str, page: int = 0):
    return await apiRequest(
        request, ENDPOINTS["user"]["watched"], page, query=f"?token={token}"
    )


@router.get("/delayed", summary="Get user delayed list")
async def GetUserDelayed(request: Request, token: str, page: int = 0):
    return await apiRequest(
        request, ENDPOINTS["user"]["delayed"], page, query=f"?token={token}"
    )


@router.get("/abandoned", summary="Get user abandoned list")
async def GetUserAbandoned(request: Request, token: str, page: int = 0):
    return await apiRequest(
        request, ENDPOINTS["user"]["abandoned"], page, query=f"?token={token}"
    )


@router.get(
    "/list/{bookmark_list_id}/{release_id}/add", summary="Add release to bookmarks list"
)
async def addReleaseToBookmarks(
    request: Request, release_id: int, bookmark_list_id: int, token: str
):
    return await apiRequest(
        request,
        f"{ENDPOINTS['profile']}/list/add/{bookmark_list_id}/{release_id}",
        query=f"?token={token}",
    )


@router.get(
    "/list/{bookmark_list_id}/{release_id}/delete",
    summary="Remove release from bookmarks list",
)
async def deleteReleaseFromBookmarks(
    request: Request, release_id: int, bookmark_list_id: int, token: str
):
    return await apiRequest(
        request,
        f"{ENDPOINTS['profile']}/list/delete/{bookmark_list_id}/{release_id}",
        query=f"?token={token}",
    )
