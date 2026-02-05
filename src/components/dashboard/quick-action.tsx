import {
  FileText,
  Users,
  CreditCard,
  Briefcase,
  Mail,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const actions: QuickAction[] = [
  {
    label: "New Invoice",
    icon: <FileText size={20} />,
    color: "bg-info/20 text-info hover:bg-info/30",
  },
  {
    label: "Add Client",
    icon: <Users size={20} />,
    color: "bg-success/20 text-success hover:bg-success/30",
  },
  {
    label: "New Project",
    icon: <Briefcase size={20} />,
    color: "bg-primary/20 text-primary hover:bg-primary/30",
  },
  {
    label: "Record Payment",
    icon: <CreditCard size={20} />,
    color: "bg-warning/20 text-warning hover:bg-warning/30",
  },
  {
    label: "Send Campaign",
    icon: <Mail size={20} />,
    color: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
  },
  {
    label: "AI Assistant",
    icon: <Bot size={20} />,
    color: "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30",
  },
];

export const QuickActions = () => {
  return (
    <div className="p-6 bg-[#0B111E]">
      <h2 className="section-title mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
              action.color,
            )}
          >
            {action.icon}
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
