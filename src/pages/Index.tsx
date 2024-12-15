import { Navigate } from "react-router-dom";

type UserRole = "admin" | "cashier";

const Index = () => {
  // For now, we'll hardcode the role. Later we'll integrate with Supabase auth
  const userRole: UserRole = "cashier";
  
  return <Navigate to={userRole === "admin" ? "/admin/products" : "/cashier"} replace />;
};

export default Index;