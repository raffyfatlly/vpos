import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Store,
  Package,
  CalendarDays,
  Menu,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
    // Only collapse on mobile
    if (window.innerWidth < 768) {
      toggle();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 md:hidden z-50"
        onClick={toggle}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar/Header Navigation */}
      <div
        className={cn(
          "bg-background border-b md:border-r z-40 transition-all duration-300",
          "fixed top-0 left-0 right-0 md:left-0 md:right-auto md:bottom-0",
          "flex flex-col h-auto md:h-full",
          isOpen ? "translate-y-0" : "-translate-y-full md:translate-y-0",
          "md:w-[70px]",
          isOpen && "md:w-60"
        )}
      >
        <div className="flex flex-col h-full relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-3 hidden md:flex h-6 w-6 border shadow-sm bg-background"
            onClick={toggle}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
          </Button>

          <div className="p-4">
            <h1 className={cn(
              "text-xl font-semibold transition-opacity duration-200",
              !isOpen && "md:opacity-0"
            )}>
              POS System
            </h1>
          </div>

          <nav className="flex md:flex-col p-2 space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-x-visible">
            {isAdmin && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors whitespace-nowrap",
                      isActive && "bg-accent",
                      !isOpen && "md:justify-center"
                    )
                  }
                >
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !isOpen && "md:hidden"
                  )}>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/admin/sessions"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors whitespace-nowrap",
                      isActive && "bg-accent",
                      !isOpen && "md:justify-center"
                    )
                  }
                >
                  <CalendarDays className="w-4 h-4 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !isOpen && "md:hidden"
                  )}>Sessions</span>
                </NavLink>
                <NavLink
                  to="/admin/products"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors whitespace-nowrap",
                      isActive && "bg-accent",
                      !isOpen && "md:justify-center"
                    )
                  }
                >
                  <Package className="w-4 h-4 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !isOpen && "md:hidden"
                  )}>Products</span>
                </NavLink>
                <NavLink
                  to="/admin/members"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors whitespace-nowrap",
                      isActive && "bg-accent",
                      !isOpen && "md:justify-center"
                    )
                  }
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !isOpen && "md:hidden"
                  )}>Members</span>
                </NavLink>
              </>
            )}

            {isCashier && (
              <NavLink
                to="/cashier"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors whitespace-nowrap",
                    isActive && "bg-accent",
                    !isOpen && "md:justify-center"
                  )
                }
              >
                <Store className="w-4 h-4 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200",
                  !isOpen && "md:hidden"
                )}>POS</span>
              </NavLink>
            )}
          </nav>

          <div className="p-2 mt-auto border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center gap-3 justify-start whitespace-nowrap",
                !isOpen && "md:justify-center"
              )}
              onClick={() => {
                handleNavClick();
                handleLogout();
              }}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
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