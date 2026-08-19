from app.database import SessionLocal
from app import models

achievements_data = [
    {
        "name": "Primo Passo",
        "description": "Aggiungi il tuo primo gioco alla libreria",
        "tier": "bronze",
        "condition_type": "games_added",
        "condition_value": 1
    },
    {
        "name": "Collezionista",
        "description": "Aggiungi 10 giochi alla libreria",
        "tier": "silver",
        "condition_type": "games_added",
        "condition_value": 10
    },
    {
        "name": "Completista",
        "description": "Completa il tuo primo gioco",
        "tier": "bronze",
        "condition_type": "games_completed",
        "condition_value": 1
    },
    {
        "name": "Maratoneta",
        "description": "Completa 10 giochi",
        "tier": "gold",
        "condition_type": "games_completed",
        "condition_value": 10
    },
    {
        "name": "Esploratore di Generi",
        "description": "Gioca a titoli di 5 generi diversi",
        "tier": "gold",
        "condition_type": "genres_played",
        "condition_value": 5
    },
    {
        "name": "Platino",
        "description": "Completa il 100% dei giochi nella tua libreria (minimo 5 giochi)",
        "tier": "platinum",
        "condition_type": "full_completion",
        "condition_value": 5
    },
]


def seed():
    db = SessionLocal()
    try:
        for ach_data in achievements_data:
            existing = db.query(models.Achievement).filter(
                models.Achievement.name == ach_data["name"]
            ).first()
            if not existing:
                achievement = models.Achievement(**ach_data)
                db.add(achievement)
        db.commit()
        print("Achievement inseriti con successo!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()