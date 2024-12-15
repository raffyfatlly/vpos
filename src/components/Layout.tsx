import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  requireRole?: "admin" | "cashier" | "both";
}

const Layout = ({ children, requireRole }: LayoutProps) => {
  const { user } = useAuth();
  const { isOpen } = useSidebar();

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
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className={cn(
        "flex-1 transition-all duration-300",
        isOpen ? "md:ml-60" : "md:ml-[70px]",
        "ml-0" // No margin on mobile when sidebar is hidden
      )}>
        <div className="container p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;