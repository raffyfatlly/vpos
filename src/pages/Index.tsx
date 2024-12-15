import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For cashiers, redirect directly to POS view
  // For admins, redirect to products page
  const redirectPath = user.role === "cashier" || user.role === "both" ? "/cashier" : "/admin/products";
  
  return <Navigate to={redirectPath} replace />;
};

export default Index;