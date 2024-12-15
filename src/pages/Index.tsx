import { Navigate } from "react-router-dom";
import { UserRole } from "@/types/pos";

const Index = () => {
  // For now, we'll hardcode the role. Later we'll integrate with Supabase auth
  const userRole: UserRole = "cashier";
  
  // Use type narrowing to ensure type safety
  const redirectPath = userRole === "admin" ? "/admin/products" : "/cashier";
  return <Navigate to={redirectPath} replace />;
};

export default Index;