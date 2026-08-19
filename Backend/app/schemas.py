from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime



class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str



class GameBase(BaseModel):
    igdb_id: int
    title: str
    cover_image: Optional[str] = None
    genre: Optional[str] = None
    platform: Optional[str] = None


class GameResponse(GameBase):
    id: int

    class Config:
        from_attributes = True


class UserGameCreate(BaseModel):
    igdb_id: int
    title: str
    cover_image: Optional[str] = None
    genre: Optional[str] = None
    platform: Optional[str] = None
    status: Optional[str] = "to_play"


class UserGameUpdate(BaseModel):
    status: Optional[str] = None
    hours_played: Optional[float] = None
    personal_rating: Optional[int] = None


class UserGameResponse(BaseModel):
    id: int
    status: str
    hours_played: float
    personal_rating: Optional[int]
    added_at: datetime
    game: GameResponse

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    tier: str
    condition_type: str
    condition_value: int

    class Config:
        from_attributes = True


class UserAchievementResponse(BaseModel):
    id: int
    unlocked_at: datetime
    achievement: AchievementResponse

    class Config:
        from_attributes = True





