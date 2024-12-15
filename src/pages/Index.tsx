import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For cashier-only users, redirect to POS
  if (user.role === "cashier") {
    return <Navigate to="/cashier" replace />;
  }
  
  // For admin or both roles, redirect to dashboard
  if (user.role === "admin" || user.role === "both") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Fallback redirect to login if somehow role is invalid
  return <Navigate to="/login" replace />;
};

export default Index;