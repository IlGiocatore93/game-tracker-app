from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, auth, igdb, achievements

from app.database import get_db
from app import models, schemas, auth, igdb

router = APIRouter(prefix="/games", tags=["Games"])


@router.get("/search")
def search_igdb(query: str, current_user: models.User = Depends(auth.get_current_user)):
    results = igdb.search_games(query)
    return results



@router.post("/library", response_model=schemas.UserGameResponse)
def add_to_library(
    game_data: schemas.UserGameCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Controlla se il gioco esiste già nel nostro database, altrimenti lo crea
    game = db.query(models.Game).filter(models.Game.igdb_id == game_data.igdb_id).first()

    if not game:
        game = models.Game(
            igdb_id=game_data.igdb_id,
            title=game_data.title,
            cover_image=game_data.cover_image,
            genre=game_data.genre,
            platform=game_data.platform
        )
        db.add(game)
        db.commit()
        db.refresh(game)

    # Controlla se l'utente ha già questo gioco in libreria
    existing = db.query(models.UserGame).filter(
        models.UserGame.user_id == current_user.id,
        models.UserGame.game_id == game.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Gioco già presente nella tua libreria"
        )

    # Crea la voce nella libreria dell'utente
    user_game = models.UserGame(
        user_id=current_user.id,
        game_id=game.id,
        status=game_data.status
    )
    db.add(user_game)
    db.commit()
    db.refresh(user_game)
    achievements.check_and_unlock_achievements(db, current_user.id)

    return user_game

    


@router.get("/library", response_model=List[schemas.UserGameResponse])
def get_library(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    library = db.query(models.UserGame).filter(
        models.UserGame.user_id == current_user.id
    ).all()
    return library


@router.put("/library/{user_game_id}", response_model=schemas.UserGameResponse)
def update_library_entry(
    user_game_id: int,
    update_data: schemas.UserGameUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    user_game = db.query(models.UserGame).filter(
        models.UserGame.id == user_game_id,
        models.UserGame.user_id == current_user.id
    ).first()

    if not user_game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voce non trovata nella tua libreria"
        )

    if update_data.status is not None:
        user_game.status = update_data.status
    if update_data.hours_played is not None:
        user_game.hours_played = update_data.hours_played
    if update_data.personal_rating is not None:
        user_game.personal_rating = update_data.personal_rating

    db.commit()
    db.refresh(user_game)
    achievements.check_and_unlock_achievements(db, current_user.id)

    return user_game




@router.delete("/library/{user_game_id}")
def delete_from_library(
    user_game_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    user_game = db.query(models.UserGame).filter(
        models.UserGame.id == user_game_id,
        models.UserGame.user_id == current_user.id
    ).first()

    if not user_game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voce non trovata nella tua libreria"
        )

    db.delete(user_game)
    db.commit()

    return {"message": "Gioco rimosso dalla libreria"}