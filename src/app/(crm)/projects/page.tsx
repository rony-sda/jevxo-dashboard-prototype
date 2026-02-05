"use client";

import { useState } from "react";
import type { Project } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, CheckCircle, Clock, PauseCircle } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { getClientById, mockClients, mockProjects } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const Projects = () => {
  const {
    data: projects,
    create,
    update,
    remove,
  } = useCrudStore<Project>({
    initialData: mockProjects,
    entityName: "Project",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const projectFields = [
    {
      key: "name",
      label: "Project Name",
      type: "text" as const,
      required: true,
    },
    {
      key: "clientId",
      label: "Client",
      type: "select" as const,
      required: true,
      options: mockClients.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "completed", label: "Completed" },
        { value: "on-hold", label: "On Hold" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      key: "budget",
      label: "Budget ($)",
      type: "number" as const,
      required: true,
    },
    {
      key: "deadline",
      label: "Deadline",
      type: "date" as const,
      required: true,
    },
  ];

  const handleAdd = () => {
    setEditingProject(null);
    setFormValues({
      status: "active",
      progress: 0,
      tasksCompleted: 0,
      totalTasks: 0,
    });
    setFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormValues({
      ...project,
      deadline: format(new Date(project.deadline), "yyyy-MM-dd"),
    });
    setFormOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeleteProject(project);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      deadline: new Date(formValues.deadline),
    };
    if (editingProject) {
      update(editingProject.id, submitValues);
    } else {
      create(submitValues as Omit<Project, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteProject) {
      remove(deleteProject.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "name", label: "Project", sortable: true },
    {
      key: "clientId",
      label: "Client",
      render: (project: Project) =>
        getClientById(project.clientId)?.name || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (project: Project) => <StatusBadge status={project.status} />,
    },
    {
      key: "progress",
      label: "Progress",
      render: (project: Project) => (
        <div className="flex items-center gap-2 w-32">
          <Progress value={project.progress} className="h-2" />
          <span className="text-xs text-muted-foreground">
            {project.progress}%
          </span>
        </div>
      ),
    },
    {
      key: "budget",
      label: "Budget",
      render: (project: Project) => `$${project.budget.toLocaleString()}`,
    },
    {
      key: "deadline",
      label: "Deadline",
      render: (project: Project) =>
        format(new Date(project.deadline), "MMM dd, yyyy"),
    },
    {
      key: "tasks",
      label: "Tasks",
      render: (project: Project) =>
        `${project.tasksCompleted}/${project.totalTasks}`,
    },
  ];

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const onHoldProjects = projects.filter((p) => p.status === "on-hold").length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Projects</h1>
        <p className="subtle-text mt-1">
          Manage your client projects and tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Briefcase className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <PauseCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold">{onHoldProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  ${totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Projects"
        data={projects}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search projects..."
        addLabel="Add Project"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingProject ? "Edit Project" : "Add New Project"}
        fields={projectFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteProject?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Projects;
