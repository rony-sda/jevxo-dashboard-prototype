"use client";

import { useState } from "react";
import type { Ticket } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Ticket as TicketIcon,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { getClientById, mockClients, mockTickets } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/20 text-info border-info/30",
  high: "bg-warning/20 text-warning border-warning/30",
  urgent: "bg-destructive/20 text-destructive border-destructive/30",
};

const Tickets = () => {
  const {
    data: tickets,
    create,
    update,
    remove,
  } = useCrudStore<Ticket>({
    initialData: mockTickets,
    entityName: "Ticket",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<Ticket | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const ticketFields = [
    { key: "title", label: "Title", type: "text" as const, required: true },
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
        { value: "open", label: "Open" },
        { value: "pending", label: "Pending" },
        { value: "closed", label: "Closed" },
      ],
    },
    {
      key: "priority",
      label: "Priority",
      type: "select" as const,
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    },
  ];

  const handleAdd = () => {
    setEditingTicket(null);
    setFormValues({
      status: "open",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setFormOpen(true);
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setFormValues(ticket);
    setFormOpen(true);
  };

  const handleDelete = (ticket: Ticket) => {
    setDeleteTicket(ticket);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      updatedAt: new Date(),
      createdAt: editingTicket?.createdAt || new Date(),
    };
    if (editingTicket) {
      update(editingTicket.id, submitValues);
    } else {
      create(submitValues as Omit<Ticket, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTicket) {
      remove(deleteTicket.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "clientId",
      label: "Client",
      render: (ticket: Ticket) => getClientById(ticket.clientId)?.name || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (ticket: Ticket) => <StatusBadge status={ticket.status} />,
    },
    {
      key: "priority",
      label: "Priority",
      render: (ticket: Ticket) => (
        <Badge variant="outline" className={priorityColors[ticket.priority]}>
          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (ticket: Ticket) =>
        format(new Date(ticket.createdAt), "MMM dd, yyyy"),
    },
    {
      key: "updatedAt",
      label: "Updated",
      render: (ticket: Ticket) =>
        format(new Date(ticket.updatedAt), "MMM dd, yyyy"),
    },
  ];

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const pendingTickets = tickets.filter((t) => t.status === "pending").length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;
  const urgentTickets = tickets.filter((t) => t.priority === "urgent").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Tickets</h1>
        <p className="subtle-text mt-1">Manage support tickets and issues</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <TicketIcon className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{openTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingTickets}</p>
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
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{closedTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/20">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{urgentTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Tickets"
        data={tickets}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search tickets..."
        addLabel="Create Ticket"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingTicket ? "Edit Ticket" : "Create New Ticket"}
        fields={ticketFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Ticket"
        description={`Are you sure you want to delete "${deleteTicket?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Tickets;
