import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, UserRole } from "@/types/pos";

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: AuthUser[] = [
  // Original users
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    username: "cashier",
    password: "cashier123",
    role: "cashier" as UserRole,
  },
  {
    id: "3",
    username: "raffyfatlly",
    password: "Type3user!",
    role: "both" as UserRole,
  },
  // New mock users
  {
    id: "4",
    username: "sarah.admin",
    password: "sarah123",
    role: "admin" as UserRole,
  },
  {
    id: "5",
    username: "john.cashier",
    password: "john123",
    role: "cashier" as UserRole,
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}