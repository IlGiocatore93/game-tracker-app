# Game Tracker App 2026

Un'app per tenere traccia dei videogiochi che gioco, con un sistema di achievement ispirato ai trofei PlayStation. L'ho costruita come progetto per un portfolio.
<br>
🔗 **Demo live:** https://gametracker-frontend-wpzb.onrender.com
<br>
🔗 **API backend:** https://gametracker-backend-o9ym.onrender.com/docs
<br>
> Gira su piano gratuito Render: al primo accesso può metterci 30-60 secondi a "svegliarsi", poi va normalmente.

## Cosa fa

- Registrazione e login con autenticazione JWT
- Ricerca giochi tramite l'API di IGDB (Internet Game Database)
- Libreria personale: aggiungi giochi, segna lo stato (da giocare / in corso / completato), ore giocate, voto
- Achievement che si sbloccano automaticamente in base a quello che fai nella libreria (tipo: aggiungi il primo gioco, completane 10, gioca a 5 generi diversi...)

<br>
![Backend](scrsht/cmd-Backend.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)
![Libreria giochi](scrsht/libreria.png)


## Stack

**Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
**Frontend:** React, TypeScript
**Infrastruttura:** Docker, Docker Compose, GitHub Actions per CI/CD
**Deploy:** Render

## Perché questo stack

Ho deciso di seguire le ultime tecnologie che ho appreso e più utilizzate come: React/TypeScript, Python/FastAPI, PostgreSQL, SQLAlchemy e Docker, quindi ci  ho costruito attorno il progetto invece di usare quello che magari mi avrebbe fatto risparmiare tempo.

## Come è fatto sotto

Il pezzo che mi è piaciuto di più costruire è il sistema di achievement: ogni volta che aggiungi o aggiorni un gioco nella libreria, il backend controlla in automatico se hai sbloccato qualche trofeo, confrontando le tue statistiche (giochi aggiunti, completati, generi diversi giocati) con le condizioni salvate nel database. Niente hardcoded — se un giorno voglio aggiungere un nuovo achievement basta inserire una riga nel database.

## Far girare il progetto in locale

Serve Docker installato. Poi:

```bash
git clone https://github.com/IlGiocatore93/game-tracker-app.git
cd game-tracker-app
```

Crea un file `.env` nella root con:
```
SECRET_KEY=una_stringa_casuale_lunga
IGDB_CLIENT_ID=il_tuo_client_id
IGDB_CLIENT_SECRET=il_tuo_client_secret
```

(Il Client ID/Secret di IGDB si ottengono registrando un'app su [dev.twitch.tv](https://dev.twitch.tv), è gratis.)

Poi:
```bash
docker compose up --build
```

Frontend su `localhost:5173`, backend su `localhost:8000` (documentazione API su `localhost:8000/docs`).

## Cosa manca / prossimi passi

Il progetto è funzionante end-to-end ma ci sono un po' di cose che vorrei aggiungere quando ho tempo:
- Un sistema di missioni che sbloccano progressivamente sezioni dell'app (progettato ma tagliato per rispettare i tempi)
- Pipeline CI più completa, con un database di test invece del solo controllo di sintassi
- Un sito portfolio a parte che raccoglie questo e altri progetti
