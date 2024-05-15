import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules import proxy
from modules.pages import bookmarks
from modules.pages import favorites
from modules.pages import index
from modules.pages import search
from modules.release import release
from modules.user import auth
from modules.user import profile

TAGS = [
    {
        "name": "Index",
        "description": "Main page API requests",
    },
    {
        "name": "Profile",
        "description": "Profile API requests",
    },
    {
        "name": "Releases",
        "description": "Releases API requests",
    },
    {
        "name": "Bookmarks",
        "description": "Bookmarks API requests",
    },
    {
        "name": "Favorites",
        "description": "Favorites API requests",
    },
    {
        "name": "Search",
        "description": "Search API requests",
    },
]

PREFIX = "/v1"

if os.getenv("API_PREFIX"):
    PREFIX = os.getenv("API_PREFIX")

app = FastAPI(
    openapi_tags=TAGS,
    title="AniX API",
    description="unofficial API proxy for Anixart android application.",
    openapi_url=f"{PREFIX}/openapi.json",
    docs_url=f"{PREFIX}/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix=f"{PREFIX}/profile", tags=["Profile"])
app.include_router(auth.router, prefix=f"{PREFIX}/auth", tags=["Profile"])

app.include_router(release.router, prefix=f"{PREFIX}/release", tags=["Releases"])

app.include_router(index.router, prefix=f"{PREFIX}/index", tags=["Index"])
app.include_router(bookmarks.router, prefix=f"{PREFIX}/bookmarks", tags=["Bookmarks"])
app.include_router(favorites.router, prefix=f"{PREFIX}/favorites", tags=["Favorites"])
app.include_router(search.router, prefix=f"{PREFIX}/search", tags=["Search"])

app.include_router(proxy.router, prefix=f"{PREFIX}/proxy")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
