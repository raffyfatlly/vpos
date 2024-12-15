import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isOpen?: boolean;
}

export function NavigationLink({ to, icon: Icon, label, onClick, isOpen }: NavigationLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          "hover:bg-primary/10 hover:text-primary",
          isActive && "bg-primary/10 text-primary",
          !isOpen && "md:justify-center"
        )
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className={cn(
        "transition-opacity duration-200",
        !isOpen && "md:hidden"
      )}>{label}</span>
    </NavLink>
  );
}