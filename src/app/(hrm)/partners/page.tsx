"use client";

import { useState } from "react";
import type { Partner } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Clock, Star } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { mockPartners } from "@/data/mock-data";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const Partners = () => {
  const {
    data: partners,
    create,
    update,
    remove,
  } = useCrudStore<Partner>({
    initialData: mockPartners,
    entityName: "Partner",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletePartner, setDeletePartner] = useState<Partner | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const partnerFields = [
    { key: "name", label: "Full Name", type: "text" as const, required: true },
    { key: "email", label: "Email", type: "email" as const, required: true },
    {
      key: "baseSalary",
      label: "Base Salary ($)",
      type: "number" as const,
      required: true,
    },
  ];

  const generateJevxoUuid = () =>
    `JVX-PTR${String(partners.length + 1).padStart(4, "0")}`;

  const calculatePayrollValues = (baseSalary: number) => {
    // 30% payable, 70% arrears (partnership payroll logic)
    return {
      payableAmount: baseSalary * 0.3,
      arrears: baseSalary * 0.7,
    };
  };

  const handleAdd = () => {
    setEditingPartner(null);
    setFormValues({});
    setFormOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormValues(partner);
    setFormOpen(true);
  };

  const handleDelete = (partner: Partner) => {
    setDeletePartner(partner);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const joiningDate = editingPartner?.joiningDate || new Date();
    const daysActive = differenceInDays(new Date(), new Date(joiningDate));
    const { payableAmount, arrears } = calculatePayrollValues(
      formValues.baseSalary || 0,
    );

    const submitValues = {
      ...formValues,
      joiningDate,
      daysActive,
      payableAmount,
      arrears,
      isShareEligible: daysActive >= 120, // 4 months = equity eligibility
      jevxoUuid: editingPartner?.jevxoUuid || generateJevxoUuid(),
    };

    if (editingPartner) {
      update(editingPartner.id, submitValues);
    } else {
      create(submitValues as Omit<Partner, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletePartner) {
      remove(deletePartner.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    {
      key: "jevxoUuid",
      label: "JEVXO ID",
      render: (p: Partner) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {p.jevxoUuid}
        </code>
      ),
    },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "joiningDate",
      label: "Joined",
      render: (p: Partner) => format(new Date(p.joiningDate), "MMM dd, yyyy"),
    },
    {
      key: "daysActive",
      label: "Days Active",
      render: (p: Partner) => `${p.daysActive} days`,
    },
    {
      key: "baseSalary",
      label: "Base Salary",
      render: (p: Partner) => `$${p.baseSalary.toLocaleString()}`,
    },
    {
      key: "payableAmount",
      label: "Payable (30%)",
      render: (p: Partner) => `$${p.payableAmount.toLocaleString()}`,
    },
    {
      key: "arrears",
      label: "Arrears (70%)",
      render: (p: Partner) => `$${p.arrears.toLocaleString()}`,
    },
    {
      key: "isShareEligible",
      label: "Equity Status",
      render: (p: Partner) => (
        <Badge
          variant={p.isShareEligible ? "default" : "secondary"}
          className={p.isShareEligible ? "bg-success/20 text-success" : ""}
        >
          {p.isShareEligible ? "Eligible" : `${120 - p.daysActive} days left`}
        </Badge>
      ),
    },
  ];

  const eligiblePartners = partners.filter((p) => p.isShareEligible).length;
  const totalPayable = partners.reduce((sum, p) => sum + p.payableAmount, 0);
  const totalArrears = partners.reduce((sum, p) => sum + p.arrears, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Partners</h1>
        <p className="subtle-text mt-1">
          Manage partnership accounts and equity tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{partners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Star className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equity Eligible</p>
                <p className="text-2xl font-bold">{eligiblePartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <DollarSign className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payable</p>
                <p className="text-2xl font-bold">
                  ${totalPayable.toLocaleString()}
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
                <p className="text-sm text-muted-foreground">Total Arrears</p>
                <p className="text-2xl font-bold">
                  ${totalArrears.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Logic Explanation */}
      <Card className="border-info/30">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-info/20">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <div>
              <h3 className="font-medium">Partnership Payroll Logic</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Until JEVXO reaches the profit threshold:{" "}
                <strong>30% of base salary is payable</strong>, remaining{" "}
                <strong>70% tracked as arrears</strong>. Partners become{" "}
                <strong>equity eligible after 120 days</strong> (4 months) of
                active partnership.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="All Partners"
        data={partners}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search partners..."
        addLabel="Add Partner"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingPartner ? "Edit Partner" : "Add New Partner"}
        fields={partnerFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Partner"
        description={`Are you sure you want to delete "${deletePartner?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Partners;
