from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


@router.get("/{release_id}", summary="Get release info by release ID")
async def GetReleaseById(request: Request, release_id: str):
    return await apiRequest(request, ENDPOINTS["release"], release_id)
