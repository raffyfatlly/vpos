import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
  requireRole?: "admin" | "cashier" | "both";
}

const Layout = ({ children, requireRole }: LayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If this is an admin route and user is not admin or both
  if (requireRole === "admin" && user.role !== "admin" && user.role !== "both") {
    return <Navigate to="/cashier" replace />;
  }

  // If this is a cashier route and user is not cashier or both
  if (requireRole === "cashier" && user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
};

export default Layout;