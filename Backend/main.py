from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models
from app.routers import auth, games, achievements

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Game Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)
app.include_router(achievements.router)

@app.get("/")
def read_root():
    return {"message": "Game Tracker API is running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}