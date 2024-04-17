import uvicorn
from fastapi import FastAPI
from modules.pages import index
from modules.release import release
from modules.user import auth
from modules.user import profile

app = FastAPI()

app.include_router(profile.router, prefix="/profile")
app.include_router(auth.router, prefix="/auth")

app.include_router(release.router, prefix="/release")

app.include_router(index.router, prefix="/page")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
