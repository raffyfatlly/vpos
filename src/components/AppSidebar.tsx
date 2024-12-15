import { Package2, ShoppingCart, BarChart3, LogOut, UserCog, Menu, CalendarDays } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types/pos";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const adminItems = [
  {
    title: "Sessions",
    path: "/admin/sessions",
    icon: CalendarDays,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: Package2,
  },
  {
    title: "Sales Overview",
    path: "/admin/sales",
    icon: BarChart3,
  },
];

const cashierItems = [
  {
    title: "Point of Sale",
    path: "/cashier",
    icon: ShoppingCart,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const userRole = "cashier" as UserRole;

  const items = userRole === "admin" ? adminItems : cashierItems;
  const menuLabel = userRole === "admin" ? "Admin" : "Cashier";
  const switchToRole = userRole === "admin" ? "cashier" as UserRole : "admin" as UserRole;
  const switchToPath = switchToRole === "admin" ? "/admin/products" : "/cashier";

  const MenuContent = () => (
    <SidebarContent className="flex flex-col h-full">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-primary">POS System</h1>
      </div>
      <SidebarGroup>
        <SidebarGroupLabel>{menuLabel} Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton onClick={() => navigate(item.path)}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div className="mt-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate(switchToPath)}>
                  <UserCog className="w-5 h-5" />
                  <span>Switch to {switchToRole}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </SidebarContent>
  );

  return (
    <>
      {/* Mobile Menu */}
      <div className="fixed top-0 left-0 z-50 w-full bg-white border-b md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-xl font-bold text-primary">POS System</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MenuContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar>
          <MenuContent />
        </Sidebar>
      </div>
    </>
  );
}