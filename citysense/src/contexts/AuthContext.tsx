import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_CREDENTIALS = { username: "admin", password: "admin123", role: "System Administrator" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("smartcity_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username: string, password: string) => {
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      const u = { username: DEMO_CREDENTIALS.username, role: DEMO_CREDENTIALS.role };
      setUser(u);
      sessionStorage.setItem("smartcity_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("smartcity_user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
