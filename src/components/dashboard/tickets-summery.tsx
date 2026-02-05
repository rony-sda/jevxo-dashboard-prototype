import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface TicketStats {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const ticketStats: TicketStats[] = [
  {
    label: "Open",
    count: 12,
    icon: <MessageSquare size={18} />,
    color: "text-info bg-info/20",
  },
  {
    label: "Pending",
    count: 8,
    icon: <Clock size={18} />,
    color: "text-warning bg-warning/20",
  },
  {
    label: "Urgent",
    count: 3,
    icon: <AlertTriangle size={18} />,
    color: "text-destructive bg-destructive/20",
  },
  {
    label: "Resolved",
    count: 45,
    icon: <CheckCircle2 size={18} />,
    color: "text-success bg-success/20",
  },
];

interface RecentTicket {
  id: string;
  title: string;
  client: string;
  priority: "low" | "medium" | "high" | "urgent";
  time: string;
}

const recentTickets: RecentTicket[] = [
  {
    id: "TKT-089",
    title: "Login issues on mobile",
    client: "TechStart",
    priority: "high",
    time: "5m",
  },
  {
    id: "TKT-088",
    title: "Invoice calculation error",
    client: "Acme Corp",
    priority: "urgent",
    time: "12m",
  },
  {
    id: "TKT-087",
    title: "Feature request: Dark mode",
    client: "GlobalTech",
    priority: "low",
    time: "1h",
  },
  {
    id: "TKT-086",
    title: "API integration help",
    client: "StartupHub",
    priority: "medium",
    time: "2h",
  },
];

const getPriorityStyles = (priority: RecentTicket["priority"]) => {
  const styles = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-info/20 text-info",
    high: "bg-warning/20 text-warning",
    urgent: "bg-destructive/20 text-destructive",
  };
  return styles[priority];
};

export const TicketsSummary = () => {
  return (
    <div className="p-6 bg-[#0B111E]">
      <h2 className="section-title mb-6">Support Tickets</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ticketStats.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-3 rounded-lg bg-secondary/30"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center",
                stat.color,
              )}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.count}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Recent Tickets
        </h3>
        {recentTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
          >
            <span className="text-xs font-mono text-muted-foreground">
              {ticket.id}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {ticket.title}
              </p>
              <p className="text-xs text-muted-foreground">{ticket.client}</p>
            </div>
            <span
              className={cn(
                "status-badge text-xs",
                getPriorityStyles(ticket.priority),
              )}
            >
              {ticket.priority}
            </span>
            <span className="text-xs text-muted-foreground">{ticket.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
