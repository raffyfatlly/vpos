import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/contexts/SessionContext";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { POSContent } from "@/components/pos/POSContent";

const POS = () => {
  const { user } = useAuth();
  const { currentSession, currentStaff, clearSession } = useSession();

  // Effect to clear session on component mount
  useEffect(() => {
    clearSession();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  if (!currentSession || !currentStaff) {
    return <SessionSelector />;
  }

  if (currentSession.status !== "active") {
    clearSession();
    return <SessionSelector />;
  }

  return <POSContent />;
};

export default POS;