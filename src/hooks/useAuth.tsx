import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, UserRole } from "@/types/pos";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: AuthUser[] = [
  {
    id: "1",
    username: "admin",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    username: "cashier",
    role: "cashier" as UserRole,
  },
  {
    id: "3",
    username: "raffyfatlly",
    role: "both" as UserRole,
  },
  {
    id: "4",
    username: "sarah.admin",
    role: "admin" as UserRole,
  },
  {
    id: "5",
    username: "john.cashier",
    role: "cashier" as UserRole,
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const email = session.user.email;
        const mockUser = mockUsers.find(u => u.username === email);
        if (mockUser) {
          setUser(mockUser);
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const email = session.user.email;
        const mockUser = mockUsers.find(u => u.username === email);
        if (mockUser) {
          setUser(mockUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      throw new Error("Invalid credentials");
    }

    const mockUser = mockUsers.find(u => u.username === username);
    if (mockUser) {
      setUser(mockUser);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login", { replace: true });
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