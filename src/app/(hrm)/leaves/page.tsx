"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { useCrudStore } from "@/hooks/use-cardstore";
import {
  getStaffById,
  LeaveRequest,
  mockLeaveRequests,
  mockStaff,
} from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";

const LeaveManagement = () => {
  const {
    data: leaves,
    create,
    update,
  } = useCrudStore<LeaveRequest>({
    initialData: mockLeaveRequests,
    entityName: "Leave Request",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const leaveFields = [
    {
      key: "staffId",
      label: "Staff Member",
      type: "select" as const,
      required: true,
      options: mockStaff.map((s) => ({ value: s.id, label: s.name })),
    },
    {
      key: "type",
      label: "Leave Type",
      type: "select" as const,
      required: true,
      options: [
        { value: "annual", label: "Annual Leave" },
        { value: "sick", label: "Sick Leave" },
        { value: "personal", label: "Personal Leave" },
        { value: "unpaid", label: "Unpaid Leave" },
      ],
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date" as const,
      required: true,
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date" as const,
      required: true,
    },
    {
      key: "reason",
      label: "Reason",
      type: "textarea" as const,
      required: true,
    },
  ];

  const handleAdd = () => {
    setEditingLeave(null);
    setFormValues({ status: "pending", createdAt: new Date() });
    setFormOpen(true);
  };

  const handleEdit = (leave: LeaveRequest) => {
    setEditingLeave(leave);
    setFormValues({
      ...leave,
      startDate: format(new Date(leave.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(leave.endDate), "yyyy-MM-dd"),
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      startDate: new Date(formValues.startDate),
      endDate: new Date(formValues.endDate),
      status: editingLeave?.status || "pending",
      createdAt: editingLeave?.createdAt || new Date(),
    };
    if (editingLeave) {
      update(editingLeave.id, submitValues);
    } else {
      create(submitValues as Omit<LeaveRequest, "id">);
    }
    setFormOpen(false);
  };

  const handleApprove = (leave: LeaveRequest) => {
    update(leave.id, { status: "approved", approvedBy: "1" });
    toast("Leave Approved", {
      description: `Leave request for ${getStaffById(leave.staffId)?.name} has been approved.`,
    });
  };

  const handleReject = (leave: LeaveRequest) => {
    update(leave.id, { status: "rejected" });
    toast.warning("Leave Rejected", {
      description: `Leave request for ${getStaffById(leave.staffId)?.name} has been rejected.`,
    });
  };

  const leaveTypeColors = {
    annual: "bg-info/20 text-info",
    sick: "bg-warning/20 text-warning",
    personal: "bg-primary/20 text-primary",
    unpaid: "bg-muted text-muted-foreground",
  };

  const columns = [
    {
      key: "staffId",
      label: "Staff",
      render: (l: LeaveRequest) => getStaffById(l.staffId)?.name || "N/A",
    },
    {
      key: "type",
      label: "Type",
      render: (l: LeaveRequest) => (
        <Badge variant="outline" className={leaveTypeColors[l.type]}>
          {l.type.charAt(0).toUpperCase() + l.type.slice(1)}
        </Badge>
      ),
    },
    {
      key: "startDate",
      label: "Start",
      render: (l: LeaveRequest) =>
        format(new Date(l.startDate), "MMM dd, yyyy"),
    },
    {
      key: "endDate",
      label: "End",
      render: (l: LeaveRequest) => format(new Date(l.endDate), "MMM dd, yyyy"),
    },
    {
      key: "duration",
      label: "Days",
      render: (l: LeaveRequest) =>
        differenceInDays(new Date(l.endDate), new Date(l.startDate)) + 1,
    },
    {
      key: "reason",
      label: "Reason",
      render: (l: LeaveRequest) =>
        l.reason.slice(0, 30) + (l.reason.length > 30 ? "..." : ""),
    },
    {
      key: "status",
      label: "Status",
      render: (l: LeaveRequest) => <StatusBadge status={l.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (l: LeaveRequest) =>
        l.status === "pending" ? (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-success hover:text-success"
              onClick={() => handleApprove(l)}
            >
              <CheckCircle size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => handleReject(l)}
            >
              <XCircle size={16} />
            </Button>
          </div>
        ) : null,
    },
  ];

  const pendingLeaves = leaves.filter((l) => l.status === "pending").length;
  const approvedLeaves = leaves.filter((l) => l.status === "approved").length;
  const totalDaysRequested = leaves.reduce(
    (sum, l) =>
      sum + differenceInDays(new Date(l.endDate), new Date(l.startDate)) + 1,
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="module-header">Leave Management</h1>
          <p className="subtle-text mt-1">
            Manage leave requests and approvals
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={16} />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{leaves.length}</p>
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
                <p className="text-2xl font-bold">{pendingLeaves}</p>
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
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedLeaves}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Calendar className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Requested</p>
                <p className="text-2xl font-bold">{totalDaysRequested}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Leave Requests"
        data={leaves}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        searchPlaceholder="Search requests..."
        addLabel="New Request"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingLeave ? "Edit Leave Request" : "New Leave Request"}
        fields={leaveFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default LeaveManagement;
