import { Navigate } from "react-router-dom";
import { UserRole } from "@/types/pos";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const userRole = user?.role || "cashier";
  
  return <Navigate to={userRole === "admin" ? "/admin/products" : "/cashier"} replace />;
};

export default Index;