import { Navigate } from "react-router-dom";
import { UserRole } from "@/types/pos";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For users with both roles, default to admin view
  const redirectPath = user.role === "cashier" ? "/cashier" : "/admin/products";
  
  return <Navigate to={redirectPath} replace />;
};

export default Index;