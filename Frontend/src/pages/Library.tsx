import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { searchGames, getLibrary, addToLibrary, updateLibraryEntry, deleteFromLibrary } from "../services/games";
import type { IgdbGame } from "../services/games";
import type { UserGame } from "../types";

export function Library() {
  const { user, logout } = useAuth();
  const [library, setLibrary] = useState<UserGame[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IgdbGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  async function loadLibrary() {
    try {
      const data = await getLibrary();
      setLibrary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLibrary();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError("");
    try {
      const results = await searchGames(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nella ricerca");
    } finally {
      setSearching(false);
    }
  }

  async function handleAddGame(game: IgdbGame) {
    try {
      await addToLibrary({
        igdb_id: game.id,
        title: game.name,
        cover_image: game.cover?.url,
        genre: game.genres?.[0]?.name,
        platform: game.platforms?.[0]?.name,
        status: "to_play",
      });
      await loadLibrary();
      setSearchResults([]);
      setSearchQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'aggiunta del gioco");
    }
  }

  async function handleStatusChange(userGameId: number, status: string) {
    try {
      await updateLibraryEntry(userGameId, { status });
      await loadLibrary();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'aggiornamento");
    }
  }

  async function handleDelete(userGameId: number) {
    try {
      await deleteFromLibrary(userGameId);
      await loadLibrary();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nella rimozione");
    }
  }

  return (
    <div className="page">
      <div className="header">
        <h1>Game Tracker</h1>
        <div className="header-actions">
          <Link to="/achievements" className="link-btn">🏆 Achievement</Link>
          <span className="username">Ciao, {user?.username}</span>
          <button onClick={logout} className="btn-ghost">Logout</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <section>
        <h2 style={{ marginBottom: "12px", fontSize: "18px" }}>Cerca un gioco</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Es. Zelda, Mario, Pokemon..."
          />
          <button type="submit" disabled={searching} className="btn">
            {searching ? "Ricerca..." : "Cerca"}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((game) => (
              <div key={game.id} className="search-card">
                {game.cover?.url && (
                  <img
                    src={`https:${game.cover.url.replace("t_thumb", "t_cover_small")}`}
                    alt={game.name}
                  />
                )}
                <p>{game.name}</p>
                <button onClick={() => handleAddGame(game)} className="btn">
                  + Aggiungi
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ marginBottom: "12px", fontSize: "18px" }}>La tua libreria ({library.length})</h2>
        {loading ? (
          <p className="empty-state">Caricamento...</p>
        ) : library.length === 0 ? (
          <p className="empty-state">Nessun gioco in libreria. Cerca qualcosa sopra per iniziare!</p>
        ) : (
          <div className="library-list">
            {library.map((ug) => (
              <div key={ug.id} className="library-item">
                {ug.game.cover_image && (
                  <img
                    src={`https:${ug.game.cover_image.replace("t_thumb", "t_cover_small")}`}
                    alt={ug.game.title}
                  />
                )}
                <div className="info">
                  <p>{ug.game.title}</p>
                  <p>{ug.game.genre} · {ug.hours_played}h giocate</p>
                </div>
                <select value={ug.status} onChange={(e) => handleStatusChange(ug.id, e.target.value)}>
                  <option value="to_play">Da giocare</option>
                  <option value="playing">In corso</option>
                  <option value="completed">Completato</option>
                </select>
                <button onClick={() => handleDelete(ug.id)} className="btn-ghost">Rimuovi</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}