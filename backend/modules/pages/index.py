import json
from typing import Union

from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


async def GetMainPageFilter(
    request: Request, page: int = 0, status_id: Union[None, int] = None
):
    data = json.dumps(
        {
            "country": None,
            "season": None,
            "sort": 0,
            "studio": None,
            "age_ratings": [],
            "category_id": None,
            "end_year": None,
            "episode_duration_from": None,
            "episode_duration_to": None,
            "episodes_from": None,
            "episodes_to": None,
            "genres": [],
            "profile_list_exclusions": [],
            "start_year": None,
            "status_id": status_id,
            "types": [],
            "is_genres_exclude_mode_enabled": False,
        }
    )
    return await apiRequest(request, ENDPOINTS["filter"], page, data=data)


@router.get("/last", summary="Get new releases")
async def GetMainPage(request: Request, page: int = 0):
    return await GetMainPageFilter(request, page, None)


@router.get("/ongoing", summary="Get ongoing releases")
async def GetOngoingPage(request: Request, page: int = 0):
    return await GetMainPageFilter(request, page, 2)


@router.get("/announce", summary="Get announced releases")
async def GetAnnouncePage(request: Request, page: int = 0):
    return await GetMainPageFilter(request, page, 3)


@router.get("/finished", summary="Get finished releases")
async def GetFinishedPage(request: Request, page: int = 0):
    return await GetMainPageFilter(request, page, 1)
