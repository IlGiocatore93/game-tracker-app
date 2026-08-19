from sqlalchemy.orm import Session
from app import models


def check_and_unlock_achievements(db: Session, user_id: int):
    """Controlla tutte le condizioni achievement per l'utente e sblocca quelle raggiunte."""

    user_games = db.query(models.UserGame).filter(
        models.UserGame.user_id == user_id
    ).all()

    games_added = len(user_games)
    games_completed = len([ug for ug in user_games if ug.status == "completed"])

    # Generi diversi giocati (tra i giochi aggiunti, non solo completati)
    genres = set()
    for ug in user_games:
        if ug.game and ug.game.genre:
            genres.add(ug.game.genre)
    genres_played = len(genres)

    # Percentuale di completamento (per l'achievement Platino)
    full_completion = (games_added > 0 and games_completed == games_added)

    achievements = db.query(models.Achievement).all()
    newly_unlocked = []

    for achievement in achievements:
        # Salta se già sbloccato
        already_unlocked = db.query(models.UserAchievement).filter(
            models.UserAchievement.user_id == user_id,
            models.UserAchievement.achievement_id == achievement.id
        ).first()
        if already_unlocked:
            continue

        unlocked = False

        if achievement.condition_type == "games_added":
            unlocked = games_added >= achievement.condition_value
        elif achievement.condition_type == "games_completed":
            unlocked = games_completed >= achievement.condition_value
        elif achievement.condition_type == "genres_played":
            unlocked = genres_played >= achievement.condition_value
        elif achievement.condition_type == "full_completion":
            unlocked = full_completion and games_added >= achievement.condition_value

        if unlocked:
            user_achievement = models.UserAchievement(
                user_id=user_id,
                achievement_id=achievement.id
            )
            db.add(user_achievement)
            newly_unlocked.append(achievement)

    if newly_unlocked:
        db.commit()

    return newly_unlocked