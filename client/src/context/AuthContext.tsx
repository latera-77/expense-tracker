import { useEffect, useState, type ReactNode } from "react";
import { api, clearToken, getToken, setToken } from "../lib/api";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => getToken() !== null);

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    api<User>("/api/auth/me")
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(email: string, password: string) {
    await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await login(email, password);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}