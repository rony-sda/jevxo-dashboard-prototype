"use client";
import { useState } from "react";
import type { Client } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Briefcase, TrendingUp } from "lucide-react";
import { useCrudStore } from "@/hooks/use-cardstore";
import { mockClients } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const clientFields = [
  { key: "name", label: "Name", type: "text" as const, required: true },
  { key: "email", label: "Email", type: "email" as const, required: true },
  { key: "company", label: "Company", type: "text" as const },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];

const Clients = () => {
  const {
    data: clients,
    create,
    update,
    remove,
  } = useCrudStore<Client>({
    initialData: mockClients,
    entityName: "Client",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleAdd = () => {
    setEditingClient(null);
    setFormValues({ status: "active", totalProjects: 0, totalRevenue: 0 });
    setFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormValues(client);
    setFormOpen(true);
  };

  const handleDelete = (client: Client) => {
    setDeleteClient(client);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editingClient) {
      update(editingClient.id, formValues);
    } else {
      create(formValues as Omit<Client, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteClient) {
      remove(deleteClient.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    { key: "company", label: "Company" },
    {
      key: "status",
      label: "Status",
      render: (client: Client) => <StatusBadge status={client.status} />,
    },
    { key: "totalProjects", label: "Projects", sortable: true },
    {
      key: "totalRevenue",
      label: "Revenue",
      sortable: true,
      render: (client: Client) => `$${client.totalRevenue.toLocaleString()}`,
    },
  ];

  const activeClients = clients.filter((c) => c.status === "active").length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalProjects = clients.reduce((sum, c) => sum + c.totalProjects, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Clients</h1>
        <p className="subtle-text mt-1">Manage your client database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{activeClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Briefcase className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Client Directory"
        data={clients}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search clients..."
        addLabel="Add Client"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingClient ? "Edit Client" : "Add New Client"}
        fields={clientFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Client"
        description={`Are you sure you want to delete "${deleteClient?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Clients;
