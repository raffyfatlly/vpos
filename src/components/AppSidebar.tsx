import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Store,
  Settings,
  Package,
  CalendarDays,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { isOpen, toggle } = useSidebar();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin" || user?.role === "both";
  const isCashier = user?.role === "cashier" || user?.role === "both";

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={toggle}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r z-40 transition-all duration-300 md:translate-x-0",
          isOpen ? "translate-x-0 w-60" : "-translate-x-full md:translate-x-0 md:w-[70px]"
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

          <nav className="flex-1 p-2 space-y-1">
            {isAdmin && (
              <>
                <NavLink
                  to="/admin/sessions"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
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
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
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
                  to="/admin/settings"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                      isActive && "bg-accent",
                      !isOpen && "md:justify-center"
                    )
                  }
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !isOpen && "md:hidden"
                  )}>Settings</span>
                </NavLink>
              </>
            )}

            {isCashier && (
              <NavLink
                to="/cashier"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
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
        </div>
      </div>
    </>
  );
}