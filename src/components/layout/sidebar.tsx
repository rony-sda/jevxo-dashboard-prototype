"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Briefcase,
  CreditCard,
  ShoppingBag,
  Ticket,
  BarChart3,
  Building2,
  UserCog,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Globe,
  Mail,
  Palette,
  Shield,
  Megaphone,
  FolderKanban,
  Receipt,
  Bot,
} from "lucide-react";
import type { DashboardView } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  currentView: DashboardView;
}

interface NavItemType {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: NavItemType[];
}

const adminNavItems: NavItemType[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  {
    label: "Content Management",
    icon: <FileText size={20} />,
    path: "/cms",
    children: [
      { label: "Pages", icon: <Globe size={20} />, path: "/cms/pages" },
      { label: "Blog Posts", icon: <FileText size={20} />, path: "/cms/blog" },
      {
        label: "Portfolio",
        icon: <FolderKanban size={20} />,
        path: "/cms/portfolio",
      },
    ],
  },
  {
    label: "Marketing",
    icon: <Megaphone size={20} />,
    path: "/marketing",
    children: [
      {
        label: "Banners",
        icon: <Palette size={20} />,
        path: "/marketing/banners",
      },
      {
        label: "Email Campaigns",
        icon: <Mail size={20} />,
        path: "/marketing/email",
      },
    ],
  },
  {
    label: "System Settings",
    icon: <Settings size={20} />,
    path: "/settings",
  },
  { label: "Role Management", icon: <Shield size={20} />, path: "/roles" },
];

const crmNavItems: NavItemType[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  { label: "Clients", icon: <Users size={20} />, path: "/clients", badge: 24 },
  {
    label: "Projects",
    icon: <Briefcase size={20} />,
    path: "/projects",
    badge: 8,
  },
  { label: "Tickets", icon: <Ticket size={20} />, path: "/tickets", badge: 5 },
  { label: "Invoices", icon: <Receipt size={20} />, path: "/invoices" },
  { label: "Shop", icon: <ShoppingBag size={20} />, path: "/shop" },
  { label: "AI Assistant", icon: <Bot size={20} />, path: "/ai-assistant" },
  { label: "Reports", icon: <BarChart3 size={20} />, path: "/reports" },
];

const hrmNavItems: NavItemType[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  {
    label: "Organization",
    icon: <Building2 size={20} />,
    path: "/organization",
  },
  { label: "Staff Management", icon: <UserCog size={20} />, path: "/staff" },
  { label: "Partners", icon: <Users size={20} />, path: "/partners" },
  { label: "Payroll", icon: <CreditCard size={20} />, path: "/payroll" },
  { label: "Attendance", icon: <Calendar size={20} />, path: "/attendance" },
  { label: "Leave Management", icon: <Calendar size={20} />, path: "/leaves" },
];

const NavItemComponent = ({
  item,
  depth = 0,
}: {
  item: NavItemType;
  depth?: number;
}) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="bg-[#090E1A]">
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-foreground cursor-pointer",
          isActive &&
            "bg-sidebar-accent text-foreground border-l-2 border-primary",
          depth > 0 && "ml-4",
        )}
        onClick={() => (hasChildren ? setIsExpanded(!isExpanded) : null)}
      >
        {hasChildren ? (
          <>
            <span className="flex items-center gap-3 flex-1">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </span>
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </>
        ) : (
          <Link href={item.path} className="flex items-center gap-3 flex-1">
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent key={child.path} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ currentView }: SidebarProps) => {
  const navItems =
    currentView === "admin"
      ? adminNavItems
      : currentView === "crm"
        ? crmNavItems
        : hrmNavItems;

  const viewLabels = {
    admin: "Admin Portal",
    crm: "CRM Dashboard",
    hrm: "HRM Suite",
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">J</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">JEVXO</h1>
            <p className="text-xs text-muted-foreground">
              {viewLabels[currentView]}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItemComponent key={item.path} item={item} />
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">
              AD
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground truncate">
              admin@jevxo.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
