import uvicorn
from fastapi import FastAPI
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
        "name": "Favorites",
        "description": "Favorites API requests",
    },
    {
        "name": "Search",
        "description": "Search API requests",
    },
]

app = FastAPI(
            openapi_tags=TAGS, 
            title="AniX API",
            description="unofficial API proxy for Anixart android application.",)

app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(auth.router, prefix="/auth", tags=["Profile"])

app.include_router(release.router, prefix="/release", tags=["Releases"])

app.include_router(index.router, prefix="/index", tags=["Index"])
app.include_router(favorites.router, prefix="/favorites", tags=["Favorites"])
app.include_router(search.router, prefix="/search", tags=["Search"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
