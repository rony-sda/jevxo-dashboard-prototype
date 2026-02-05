"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Building2 } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import {
  getBranchById,
  getDepartmentById,
  mockBranches,
  mockDepartments,
  mockDesignations,
  mockStaff,
  Staff,
} from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const StaffManagement = () => {
  const {
    data: staff,
    create,
    update,
    remove,
  } = useCrudStore<Staff>({
    initialData: mockStaff,
    entityName: "Staff",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<Staff | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const staffFields = [
    { key: "name", label: "Full Name", type: "text" as const, required: true },
    { key: "email", label: "Email", type: "email" as const, required: true },
    { key: "phone", label: "Phone", type: "text" as const, required: true },
    {
      key: "role",
      label: "Role",
      type: "select" as const,
      required: true,
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "hr", label: "HR" },
        { value: "partner", label: "Partner" },
      ],
    },
    {
      key: "branchId",
      label: "Branch",
      type: "select" as const,
      required: true,
      options: mockBranches.map((b) => ({ value: b.id, label: b.name })),
    },
    {
      key: "departmentId",
      label: "Department",
      type: "select" as const,
      required: true,
      options: mockDepartments.map((d) => ({ value: d.id, label: d.name })),
    },
    {
      key: "designationId",
      label: "Designation",
      type: "select" as const,
      required: true,
      options: mockDesignations.map((d) => ({ value: d.id, label: d.title })),
    },
    {
      key: "baseSalary",
      label: "Base Salary ($)",
      type: "number" as const,
      required: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "on-leave", label: "On Leave" },
      ],
    },
  ];

  const generateJevxoUuid = () =>
    `JVX-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const handleAdd = () => {
    setEditingStaff(null);
    setFormValues({
      status: "active",
      jevxoUuid: generateJevxoUuid(),
      joiningDate: new Date(),
    });
    setFormOpen(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormValues(staffMember);
    setFormOpen(true);
  };

  const handleDelete = (staffMember: Staff) => {
    setDeleteStaff(staffMember);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      joiningDate: editingStaff?.joiningDate || new Date(),
      jevxoUuid: editingStaff?.jevxoUuid || generateJevxoUuid(),
    };
    if (editingStaff) {
      update(editingStaff.id, submitValues);
    } else {
      create(submitValues as Omit<Staff, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteStaff) {
      remove(deleteStaff.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    {
      key: "jevxoUuid",
      label: "JEVXO ID",
      render: (s: Staff) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {s.jevxoUuid}
        </code>
      ),
    },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (s: Staff) => (
        <Badge variant="outline" className="capitalize">
          {s.role}
        </Badge>
      ),
    },
    {
      key: "branchId",
      label: "Branch",
      render: (s: Staff) => getBranchById(s.branchId)?.name || "N/A",
    },
    {
      key: "departmentId",
      label: "Department",
      render: (s: Staff) => getDepartmentById(s.departmentId)?.name || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (s: Staff) => <StatusBadge status={s.status} />,
    },
    {
      key: "joiningDate",
      label: "Joined",
      render: (s: Staff) => format(new Date(s.joiningDate), "MMM dd, yyyy"),
    },
  ];

  const activeStaff = staff.filter((s) => s.status === "active").length;
  const onLeaveStaff = staff.filter((s) => s.status === "on-leave").length;
  const branchCount = new Set(staff.map((s) => s.branchId)).size;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Staff Management</h1>
        <p className="subtle-text mt-1">
          Manage employees and their assignments
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
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <UserX className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold">{onLeaveStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Building2 className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branches</p>
                <p className="text-2xl font-bold">{branchCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Staff"
        data={staff}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search staff..."
        addLabel="Add Staff"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingStaff ? "Edit Staff" : "Add New Staff"}
        fields={staffFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Staff"
        description={`Are you sure you want to delete "${deleteStaff?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default StaffManagement;
