import { Package2, ShoppingCart, BarChart3, LogOut, UserCog } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types/pos";

const adminItems = [
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
  const userRole: UserRole = "cashier";

  const items = userRole === "admin" ? adminItems : cashierItems;
  const menuLabel = userRole === "admin" ? "Admin" : "Cashier";
  const switchToRole: UserRole = userRole === "admin" ? "cashier" : "admin";
  const switchToPath = switchToRole === "admin" ? "/admin/products" : "/cashier";

  return (
    <Sidebar>
      <SidebarContent>
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
      </SidebarContent>
    </Sidebar>
  );
}
