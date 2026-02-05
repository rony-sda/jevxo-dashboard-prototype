"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, UserCheck, UserX, Clock, Home } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import {
  Attendance,
  getStaffById,
  mockAttendance,
  mockStaff,
} from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";

const AttendancePage = () => {
  const {
    data: attendance,
    create,
    update,
  } = useCrudStore<Attendance>({
    initialData: mockAttendance,
    entityName: "Attendance",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const attendanceFields = [
    {
      key: "staffId",
      label: "Staff Member",
      type: "select" as const,
      required: true,
      options: mockStaff.map((s) => ({ value: s.id, label: s.name })),
    },
    { key: "date", label: "Date", type: "date" as const, required: true },
    {
      key: "checkIn",
      label: "Check In Time",
      type: "text" as const,
      placeholder: "HH:MM (e.g., 09:00)",
    },
    {
      key: "checkOut",
      label: "Check Out Time",
      type: "text" as const,
      placeholder: "HH:MM (e.g., 18:00)",
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "present", label: "Present" },
        { value: "absent", label: "Absent" },
        { value: "half-day", label: "Half Day" },
        { value: "remote", label: "Remote" },
      ],
    },
    { key: "notes", label: "Notes", type: "textarea" as const },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    setFormValues({
      status: "present",
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setFormOpen(true);
  };

  const handleEdit = (record: Attendance) => {
    setEditingRecord(record);
    setFormValues({
      ...record,
      date: format(new Date(record.date), "yyyy-MM-dd"),
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      date: new Date(formValues.date),
    };
    if (editingRecord) {
      update(editingRecord.id, submitValues);
    } else {
      create(submitValues as Omit<Attendance, "id">);
    }
    setFormOpen(false);
  };

  const columns = [
    {
      key: "staffId",
      label: "Staff",
      render: (a: Attendance) => getStaffById(a.staffId)?.name || "N/A",
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (a: Attendance) => format(new Date(a.date), "MMM dd, yyyy"),
    },
    {
      key: "checkIn",
      label: "Check In",
      render: (a: Attendance) => a.checkIn || "-",
    },
    {
      key: "checkOut",
      label: "Check Out",
      render: (a: Attendance) => a.checkOut || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (a: Attendance) => <StatusBadge status={a.status} />,
    },
    { key: "notes", label: "Notes", render: (a: Attendance) => a.notes || "-" },
  ];

  const todayAttendance = attendance.filter(
    (a) =>
      format(new Date(a.date), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd"),
  );
  const presentToday = todayAttendance.filter(
    (a) => a.status === "present" || a.status === "remote",
  ).length;
  const absentToday = todayAttendance.filter(
    (a) => a.status === "absent",
  ).length;
  const remoteToday = todayAttendance.filter(
    (a) => a.status === "remote",
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="module-header">Attendance</h1>
          <p className="subtle-text mt-1">Track daily attendance records</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Clock size={16} />
          Log Attendance
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
                <p className="text-sm text-muted-foreground">Today's Date</p>
                <p className="text-lg font-bold">
                  {format(new Date(), "MMM dd, yyyy")}
                </p>
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
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold">{presentToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/20">
                <UserX className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent Today</p>
                <p className="text-2xl font-bold">{absentToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Home className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remote Today</p>
                <p className="text-2xl font-bold">{remoteToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Attendance Records"
        data={attendance}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        searchPlaceholder="Search attendance..."
        addLabel="Log Attendance"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingRecord ? "Edit Attendance" : "Log Attendance"}
        fields={attendanceFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AttendancePage;
