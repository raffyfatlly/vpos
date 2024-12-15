import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileHeader() {
  const { isOpen, toggle } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b md:hidden z-50 flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold">POS System</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="relative"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </header>
  );
}