import { Navigate } from "react-router-dom";

const Index = () => {
  // For now, we'll hardcode the role. Later we'll integrate with Supabase auth
  const userRole = "admin";
  
  return <Navigate to={userRole === "admin" ? "/admin/products" : "/cashier"} replace />;
};

export default Index;