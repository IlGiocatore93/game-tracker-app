import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, login as loginService, logout as logoutService, register as registerService } from "../services/auth";
import { getToken } from "../services/api";
import { AuthContext } from "./AuthContextObject";
import type { User } from "../types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function login(email: string, password: string) {
    await loginService(email, password);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  async function register(email: string, username: string, password: string) {
    await registerService(email, username, password);
    await login(email, password);
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}