import os 
import requests
from dotenv import load_dotenv


load_dotenv()

IGDB_CLIENT_ID = os.getenv("IGDB_CLIENT_ID")
IGDB_CLIENT_SECRET = os.getenv("IGDB_CLIENT_SECRET")


_cached_token = None

def get_igdb_token():
    global _cached_token
    if _cached_token:
        return _cached_token




    url = "https://id.twitch.tv/oauth2/token"
    params = {

        "client_id": IGDB_CLIENT_ID,
        "client_secret": IGDB_CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(url, params=params)
    response.raise_for_status()
    data = response.json()
    _cached_token = data["access_token"]
    return _cached_token


def search_games(query: str, limit: int = 10):
    token = get_igdb_token()
    url = "https://api.igdb.com/v4/games"
    headers = {
        "Client-ID": IGDB_CLIENT_ID,
        "Authorization": f"Bearer {token}"
    } 
    body = f'search "{query}"; fields name,cover.url,genres.name,platforms.name; limit {limit};'

    response = requests.post(url, headers=headers, data=body)
    response.raise_for_status()
    return response.json()  