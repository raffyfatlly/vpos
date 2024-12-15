import { Navigate } from "react-router-dom";
import { UserRole } from "@/types/pos";

const Index = () => {
  // For now, we'll hardcode the role. Later we'll integrate with auth
  const userRole: UserRole = "cashier";
  
  return <Navigate to={userRole === "admin" ? "/admin/products" : "/cashier"} replace />;
};

export default Index;