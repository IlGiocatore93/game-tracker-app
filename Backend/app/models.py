from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_games = relationship("UserGame", back_populates="user")
    user_achievements = relationship("UserAchievement", back_populates="user")  # ← nuova riga


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    igdb_id = Column(Integer, unique=True, index=True, nullable=True)
    title = Column(String, nullable=False)
    cover_image = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    platform = Column(String, nullable=True)

    # Relazione: un gioco può essere in libreria di più utenti
    user_games = relationship("UserGame", back_populates="game")





class UserGame(Base):
    __tablename__ = "user_games"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    status = Column(String, default="to_play")  # to_play / playing / completed
    hours_played = Column(Float, default=0)
    personal_rating = Column(Integer, nullable=True)  # es. 1-10
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_games")
    game = relationship("Game", back_populates="user_games")





class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    tier = Column(String, nullable=False)  # bronze / silver / gold / platinum
    condition_type = Column(String, nullable=False)  # es. "games_completed", "genres_played"
    condition_value = Column(Integer, nullable=False)  # es. 10 (per "completa 10 giochi")

    user_achievements = relationship("UserAchievement", back_populates="achievement")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")