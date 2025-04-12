
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PieChart, 
  CreditCard, 
  Target, 
  LogOut,
  Sparkles,
  Flag
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ 
  icon, 
  label, 
  href, 
  active 
}: SidebarItemProps) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
        active ? "bg-sidebar-accent text-white" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <div className="hidden border-r bg-sidebar lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-white">
            <PieChart className="h-6 w-6" />
            <span className="text-xl">SmartSpend</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2 px-4">
          <nav className="grid items-start gap-2">
            <SidebarItem 
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              href="/"
              active={pathname === "/"}
            />
            <SidebarItem 
              icon={<CreditCard className="h-4 w-4" />}
              label="Transactions"
              href="/transactions"
              active={pathname === "/transactions"}
            />
            <SidebarItem 
              icon={<Target className="h-4 w-4" />}
              label="Budgets"
              href="/budgets"
              active={pathname === "/budgets"}
            />
            <SidebarItem 
              icon={<Flag className="h-4 w-4" />}
              label="Goals"
              href="/goals"
              active={pathname === "/goals"}
            />
            <SidebarItem 
              icon={<Sparkles className="h-4 w-4" />}
              label="AI Advisor"
              href="/advisor"
              active={pathname === "/advisor"}
            />
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-white hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
