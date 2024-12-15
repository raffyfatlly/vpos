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

  if (requireRole === "admin" && user.role !== "admin" && user.role !== "both") {
    return <Navigate to="/cashier" replace />;
  }

  if (requireRole === "cashier" && user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className={cn(
        "flex-1 transition-all duration-300 flex flex-col",
        "md:ml-[70px]",
        isOpen && "md:ml-60",
        "pt-16 md:pt-0" // Add top padding for mobile to account for header
      )}>
        <div className="container p-4 md:p-6 flex-1">
          {children}
        </div>
        <footer className="py-2 px-4 text-center text-xs text-muted-foreground">
          by ubersolve
        </footer>
      </main>
    </div>
  );
}

export default Layout;