import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Store,
  Package,
  CalendarDays,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { MobileHeader } from "./navigation/MobileHeader";
import { NavigationLink } from "./navigation/NavigationLink";

export function AppSidebar() {
  const { isOpen, toggle } = useSidebar();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.role === "admin" || user?.role === "both";
  const isCashier = user?.role === "cashier" || user?.role === "both";

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
    });
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      toggle();
    }
  };

  return (
    <>
      <MobileHeader />

      {/* Sidebar Navigation */}
      <div
        className={cn(
          "bg-background/80 backdrop-blur-sm border-r z-40 transition-all duration-300",
          "fixed md:left-0 md:right-auto md:bottom-0 md:top-0",
          "w-full h-[calc(100vh-4rem)] md:h-full md:w-[70px]",
          isOpen ? (
            "top-16 translate-y-0 md:translate-y-0 md:w-60"
          ) : (
            "-translate-y-full md:translate-y-0"
          )
        )}
      >
        <div className="flex flex-col h-full relative overflow-y-auto">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-3 hidden md:flex h-6 w-6 border shadow-sm bg-background"
            onClick={toggle}
          >
            <ChevronLeft 
              className={cn(
                "h-4 w-4 transition-transform",
                !isOpen && "rotate-180"
              )} 
            />
          </Button>

          <nav className="flex flex-col p-2 space-y-1">
            {isAdmin && (
              <>
                <NavigationLink
                  to="/admin/dashboard"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  onClick={handleNavClick}
                  isOpen={isOpen}
                />
                <NavigationLink
                  to="/admin/sessions"
                  icon={CalendarDays}
                  label="Sessions"
                  onClick={handleNavClick}
                  isOpen={isOpen}
                />
                <NavigationLink
                  to="/admin/products"
                  icon={Package}
                  label="Products"
                  onClick={handleNavClick}
                  isOpen={isOpen}
                />
                <NavigationLink
                  to="/admin/members"
                  icon={Users}
                  label="Members"
                  onClick={handleNavClick}
                  isOpen={isOpen}
                />
              </>
            )}

            {isCashier && (
              <NavigationLink
                to="/cashier"
                icon={Store}
                label="POS"
                onClick={handleNavClick}
                isOpen={isOpen}
              />
            )}
          </nav>

          <div className="p-2 mt-auto border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center gap-3 justify-start",
                "hover:bg-primary/10 hover:text-primary",
                !isOpen && "md:justify-center"
              )}
              onClick={() => {
                handleNavClick();
                handleLogout();
              }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={cn(
                "transition-opacity duration-200",
                !isOpen && "md:hidden"
              )}>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}