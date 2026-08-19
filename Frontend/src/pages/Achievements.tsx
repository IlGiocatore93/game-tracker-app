import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllAchievements, getMyAchievements } from "../services/achievements";
import type { Achievement, UserAchievement } from "../types";

const tierColors: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
  platinum: "#e5e4e2",
};

export function Achievements() {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [myAchievements, setMyAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [all, mine] = await Promise.all([getAllAchievements(), getMyAchievements()]);
      setAllAchievements(all);
      setMyAchievements(mine);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const unlockedIds = new Set(myAchievements.map((ua) => ua.achievement.id));

  return (
    <div className="page">
      <div className="header">
        <h1>Achievement</h1>
        <Link to="/library" className="link-btn">← Torna alla libreria</Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      <p className="achv-progress">
        Sbloccati: <strong>{myAchievements.length}</strong> / {allAchievements.length}
      </p>

      {loading ? (
        <p className="empty-state">Caricamento...</p>
      ) : (
        <div className="achv-grid">
          {allAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`achv-card ${isUnlocked ? "" : "locked"}`}
                style={{ borderColor: isUnlocked ? tierColors[achievement.tier] : undefined }}
              >
                <div className="top">
                  <span className="name">{achievement.name}</span>
                  <span className="tier" style={{ backgroundColor: tierColors[achievement.tier] }}>
                    {achievement.tier}
                  </span>
                </div>
                <p className="desc">{achievement.description}</p>
                {!isUnlocked && <p className="lock">🔒 Bloccato</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}