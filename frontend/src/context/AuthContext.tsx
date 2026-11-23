
import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from "react";

import api from "../api/axios";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "AGENT" | "CUSTOMER";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("resolveai_token")
  );

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("resolveai_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    // Expected login response:
    // { token, user } or { data: { token, user } }
    const payload = response.data.data ?? response.data;

    const accessToken =
      payload.token ?? payload.accessToken;

    if (!accessToken || !payload.user) {
      throw new Error(
        "Login response is missing the token or user"
      );
    }

    localStorage.setItem(
      "resolveai_token",
      accessToken
    );

    localStorage.setItem(
      "resolveai_user",
      JSON.stringify(payload.user)
    );

    setToken(accessToken);
    setUser(payload.user);
  }

  function logout() {
    localStorage.removeItem("resolveai_token");
    localStorage.removeItem("resolveai_user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
