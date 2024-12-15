import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Store,
  Settings,
  Package,
  CalendarDays,
  Menu,
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
          "fixed top-0 left-0 h-full bg-background border-r z-40 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full w-60">
          <div className="p-6">
            <h1 className="text-xl font-semibold">POS System</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {isAdmin && (
              <>
                <NavLink
                  to="/admin/sessions"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors",
                      isActive && "bg-accent"
                    )
                  }
                >
                  <CalendarDays className="w-4 h-4" />
                  Sessions
                </NavLink>
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors",
                      isActive && "bg-accent"
                    )
                  }
                >
                  <Package className="w-4 h-4" />
                  Products
                </NavLink>
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors",
                      isActive && "bg-accent"
                    )
                  }
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </NavLink>
              </>
            )}

            {isCashier && (
              <NavLink
                to="/cashier"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors",
                    isActive && "bg-accent"
                  )
                }
              >
                <Store className="w-4 h-4" />
                POS
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}