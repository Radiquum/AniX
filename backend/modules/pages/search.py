import json

from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


@router.get("", summary="Search for a release")
async def Search(request: Request, query: str, page: int = 0):
    data = json.dumps({"query": query, "searchBy": 0})
    return await apiRequest(request, ENDPOINTS["search"], page, data=data)
