import { Navigate } from "react-router-dom";
import { UserRole } from "@/types/pos";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For users with admin or both roles, redirect to admin products
  // For cashiers, redirect to session selection
  const redirectPath = user.role === "cashier" ? "/admin/sessions" : "/admin/products";
  
  return <Navigate to={redirectPath} replace />;
};

export default Index;