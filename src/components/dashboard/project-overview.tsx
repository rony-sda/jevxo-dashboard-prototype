import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: "active" | "completed" | "on-hold";
  dueDate: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    client: "TechStart Inc.",
    progress: 75,
    status: "active",
    dueDate: "Feb 15, 2026",
  },
  {
    id: "2",
    name: "Mobile App Development",
    client: "GlobalTech",
    progress: 45,
    status: "active",
    dueDate: "Mar 20, 2026",
  },
  {
    id: "3",
    name: "Brand Identity Design",
    client: "Acme Corp",
    progress: 100,
    status: "completed",
    dueDate: "Jan 30, 2026",
  },
  {
    id: "4",
    name: "CRM Integration",
    client: "StartupHub",
    progress: 20,
    status: "on-hold",
    dueDate: "Apr 10, 2026",
  },
];

const getStatusStyles = (status: Project["status"]) => {
  const styles = {
    active: "status-success",
    completed: "status-info",
    "on-hold": "status-warning",
  };
  return styles[status];
};

const getProgressColor = (progress: number) => {
  if (progress >= 75) return "bg-success";
  if (progress >= 50) return "bg-primary";
  if (progress >= 25) return "bg-warning";
  return "bg-muted";
};

export const ProjectsOverview = () => {
  return (
    <div className="p-6 bg-[#0B111E]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Active Projects</h2>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {project.client}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span
                className={cn("status-badge", getStatusStyles(project.status))}
              >
                {project.status.replace("-", " ")}
              </span>
              <span className="text-xs text-muted-foreground">
                Due: {project.dueDate}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {project.progress}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getProgressColor(project.progress),
                  )}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
