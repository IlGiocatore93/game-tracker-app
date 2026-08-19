import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(email, username, password);
      } else {
        await login(email, password);
      }
      navigate("/library");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <div className="auth-card">
        <h1>{isRegisterMode ? "Registrati" : "Accedi"}</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {isRegisterMode && (
            <div className="field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} className="btn" style={{ width: "100%" }}>
            {loading ? "Attendere..." : isRegisterMode ? "Registrati" : "Accedi"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegisterMode ? "Hai già un account?" : "Non hai un account?"}{" "}
          <button type="button" onClick={() => setIsRegisterMode(!isRegisterMode)}>
            {isRegisterMode ? "Accedi" : "Registrati"}
          </button>
        </p>
      </div>
    </div>
  );
}