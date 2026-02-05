"use client";

import { useState } from "react";

import type { Invoice } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { getClientById, mockClients, mockInvoices } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const Invoices = () => {
  const {
    data: invoices,
    create,
    update,
    remove,
  } = useCrudStore<Invoice>({
    initialData: mockInvoices,
    entityName: "Invoice",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteInvoice, setDeleteInvoice] = useState<Invoice | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const num = String(invoices.length + 1).padStart(3, "0");
    return `INV-${year}-${num}`;
  };

  const invoiceFields = [
    {
      key: "invoiceNumber",
      label: "Invoice Number",
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
      key: "amount",
      label: "Amount ($)",
      type: "number" as const,
      required: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "overdue", label: "Overdue" },
      ],
    },
    {
      key: "dueDate",
      label: "Due Date",
      type: "date" as const,
      required: true,
    },
  ];

  const handleAdd = () => {
    setEditingInvoice(null);
    setFormValues({
      invoiceNumber: generateInvoiceNumber(),
      status: "pending",
      createdAt: new Date(),
    });
    setFormOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormValues({
      ...invoice,
      dueDate: format(new Date(invoice.dueDate), "yyyy-MM-dd"),
    });
    setFormOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setDeleteInvoice(invoice);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      dueDate: new Date(formValues.dueDate),
      createdAt: editingInvoice?.createdAt || new Date(),
    };
    if (editingInvoice) {
      update(editingInvoice.id, submitValues);
    } else {
      create(submitValues as Omit<Invoice, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteInvoice) {
      remove(deleteInvoice.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "invoiceNumber", label: "Invoice #", sortable: true },
    {
      key: "clientId",
      label: "Client",
      render: (invoice: Invoice) =>
        getClientById(invoice.clientId)?.name || "N/A",
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (invoice: Invoice) => `$${invoice.amount.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (invoice: Invoice) => <StatusBadge status={invoice.status} />,
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (invoice: Invoice) =>
        format(new Date(invoice.dueDate), "MMM dd, yyyy"),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (invoice: Invoice) =>
        format(new Date(invoice.createdAt), "MMM dd, yyyy"),
    },
  ];

  const paidAmount = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Invoices</h1>
        <p className="subtle-text mt-1">Manage billing and invoices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  ${totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">
                  ${paidAmount.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold">
                  ${pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">
                  ${overdueAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Invoices"
        data={invoices}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search invoices..."
        addLabel="Create Invoice"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingInvoice ? "Edit Invoice" : "Create New Invoice"}
        fields={invoiceFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice "${deleteInvoice?.invoiceNumber}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Invoices;
