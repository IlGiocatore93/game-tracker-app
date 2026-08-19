from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/achievements", tags=["Achievements"])


@router.get("/", response_model=List[schemas.AchievementResponse])
def get_all_achievements(db: Session = Depends(get_db)):
    """Lista di tutti gli achievement esistenti nel gioco (pubblica, non serve login)."""
    return db.query(models.Achievement).all()


@router.get("/me", response_model=List[schemas.UserAchievementResponse])
def get_my_achievements(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Achievement sbloccati dall'utente loggato."""
    return db.query(models.UserAchievement).filter(
        models.UserAchievement.user_id == current_user.id
    ).all()