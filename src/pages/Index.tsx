import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For cashiers, redirect to sessions page first
  // For admins, redirect to products page
  const redirectPath = user.role === "cashier" ? "/admin/sessions" : "/admin/products";
  
  return <Navigate to={redirectPath} replace />;
};

export default Index;