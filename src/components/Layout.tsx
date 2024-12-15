import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-gray-50 md:p-6 mt-[60px] md:mt-0">{children}</main>
      </div>
    </SidebarProvider>
  );
}