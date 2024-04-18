from fastapi import APIRouter
from fastapi import Request
from modules.proxy import apiRequest
from modules.proxy import ENDPOINTS

router = APIRouter()


@router.get("/{release_id}", summary="Get release info")
async def GetReleaseById(request: Request, release_id: str):
    return await apiRequest(request, ENDPOINTS["release"]["info"], release_id)


@router.get(
    "/{release_id}/voiceover", summary="Get release voiceover info"
)
async def GetReleaseVoiceover(request: Request, release_id: str):
    return await apiRequest(request, ENDPOINTS["release"]["episode"], release_id)


@router.get(
    "/{release_id}/{voiceover_id}",
    summary="Get available players for selected voiceover of a release",
)
async def GetReleaseVoiceoverPlayer(
    request: Request, release_id: str, voiceover_id: str
):
    return await apiRequest(
        request, ENDPOINTS["release"]["episode"], f"{release_id}/{voiceover_id}"
    )


@router.get(
    "/{release_id}/{voiceover_id}/{source_id}",
    summary="Get available episodes for selected voiceover and a player of a release",
)
async def GetReleaseEpisodes(
    request: Request, release_id: str, voiceover_id: str, source_id: str
):
    return await apiRequest(
        request,
        ENDPOINTS["release"]["episode"],
        f"{release_id}/{voiceover_id}/{source_id}",
    )


@router.get(
    "/{release_id}/{episode}/markWatched",
    summary="mark episode of a selected voiceover as watched",
)
async def MarkEpisodeAsWatched(
    request: Request, release_id: str, source_id: str, episode: str, token: str
):
    return await apiRequest(
        request,
        ENDPOINTS["statistic"]["markWatched"],
        f"${release_id}/${source_id}/${episode}",
        query=f"?token={token}",
    )


@router.get(
    "/{release_id}/{episode}/addHistory",
    summary="add episode of a selected voiceover to history",
)
async def AddEpisodeToHistory(
    request: Request, release_id: str, source_id: str, episode: str, token: str
):
    return await apiRequest(
        request,
        ENDPOINTS["statistic"]["addHistory"],
        f"${release_id}/${source_id}/${episode}",
        query=f"?token={token}",
    )
