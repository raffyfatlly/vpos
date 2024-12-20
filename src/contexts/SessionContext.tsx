import { createContext, useContext, useState, ReactNode } from "react";
import { Session, SessionStaff } from "@/types/pos";

interface SessionContextType {
  currentSession: Session | null;
  currentStaff: SessionStaff | null;
  setCurrentSession: (session: Session | null) => void;
  setCurrentStaff: (staff: SessionStaff | null) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentStaff, setCurrentStaff] = useState<SessionStaff | null>(null);

  const clearSession = () => {
    setCurrentSession(null);
    setCurrentStaff(null);
  };

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        currentStaff,
        setCurrentSession,
        setCurrentStaff,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}