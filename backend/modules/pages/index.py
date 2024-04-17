import json

from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


# TODO: Add filters?
@router.post("/index", summary="Get main page")
async def GetMainPage(request: Request, page: int = 0):

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
            "status_id": None,
            "types": [],
            "is_genres_exclude_mode_enabled": False,
        }
    )

    return await apiRequest(request, ENDPOINTS["filter"], page, data=data)
