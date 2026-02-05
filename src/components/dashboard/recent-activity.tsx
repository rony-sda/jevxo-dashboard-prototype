import { cn } from "@/lib/utils";
import {
  FileText,
  Users,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface Activity {
  id: string;
  type: "invoice" | "client" | "payment" | "task" | "alert" | "pending";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "payment",
    title: "Payment Received",
    description: "$2,450 from Acme Corp",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "client",
    title: "New Client Registered",
    description: "TechStart Inc. joined the platform",
    time: "15 min ago",
  },
  {
    id: "3",
    type: "task",
    title: "Project Milestone Completed",
    description: "Website redesign Phase 1 done",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "invoice",
    title: "Invoice Sent",
    description: "INV-2024-089 to GlobalTech",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "alert",
    title: "Payment Overdue",
    description: "INV-2024-072 needs attention",
    time: "3 hours ago",
  },
];

const getActivityIcon = (type: Activity["type"]) => {
  const iconMap = {
    invoice: <FileText size={16} />,
    client: <Users size={16} />,
    payment: <CreditCard size={16} />,
    task: <CheckCircle size={16} />,
    alert: <AlertCircle size={16} />,
    pending: <Clock size={16} />,
  };
  return iconMap[type];
};

const getActivityStyles = (type: Activity["type"]) => {
  const styleMap = {
    invoice: "bg-info/20 text-info",
    client: "bg-primary/20 text-primary",
    payment: "bg-success/20 text-success",
    task: "bg-success/20 text-success",
    alert: "bg-destructive/20 text-destructive",
    pending: "bg-warning/20 text-warning",
  };
  return styleMap[type];
};

export const RecentActivity = () => {
  return (
    <div className="p-6 bg-[#0B111E]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Recent Activity</h2>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                getActivityStyles(activity.type),
              )}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
