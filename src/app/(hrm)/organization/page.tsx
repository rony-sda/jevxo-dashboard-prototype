"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Briefcase, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import {
  Branch,
  Department,
  Designation,
  mockBranches,
  mockDepartments,
  mockDesignations,
} from "@/data/mock-data";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const Organization = () => {
  // Branches
  const {
    data: branches,
    create: createBranch,
    update: updateBranch,
    remove: removeBranch,
  } = useCrudStore<Branch>({
    initialData: mockBranches,
    entityName: "Branch",
  });

  // Departments
  const {
    data: departments,
    create: createDept,
    update: updateDept,
    remove: removeDept,
  } = useCrudStore<Department>({
    initialData: mockDepartments,
    entityName: "Department",
  });

  // Designations
  const {
    data: designations,
    create: createDesig,
    update: updateDesig,
    remove: removeDesig,
  } = useCrudStore<Designation>({
    initialData: mockDesignations,
    entityName: "Designation",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("branches");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const branchFields = [
    {
      key: "name",
      label: "Branch Name",
      type: "text" as const,
      required: true,
    },
    {
      key: "location",
      label: "Location",
      type: "text" as const,
      required: true,
    },
  ];

  const departmentFields = [
    {
      key: "name",
      label: "Department Name",
      type: "text" as const,
      required: true,
    },
    {
      key: "branchId",
      label: "Branch",
      type: "select" as const,
      required: true,
      options: branches.map((b) => ({ value: b.id, label: b.name })),
    },
  ];

  const designationFields = [
    { key: "title", label: "Title", type: "text" as const, required: true },
    {
      key: "level",
      label: "Level (1-5)",
      type: "number" as const,
      required: true,
    },
    {
      key: "departmentId",
      label: "Department",
      type: "select" as const,
      required: true,
      options: departments.map((d) => ({ value: d.id, label: d.name })),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormValues(
      activeTab === "branches"
        ? { createdAt: new Date() }
        : activeTab === "departments"
          ? { createdAt: new Date() }
          : {},
    );
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormValues(item);
    setFormOpen(true);
  };

  const handleDelete = (item: any) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (activeTab === "branches") {
      if (editingItem) updateBranch(editingItem.id, formValues);
      else createBranch(formValues as Omit<Branch, "id">);
    } else if (activeTab === "departments") {
      if (editingItem) updateDept(editingItem.id, formValues);
      else createDept(formValues as Omit<Department, "id">);
    } else {
      if (editingItem) updateDesig(editingItem.id, formValues);
      else createDesig(formValues as Omit<Designation, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeTab === "branches") removeBranch(deleteItem.id);
    else if (activeTab === "departments") removeDept(deleteItem.id);
    else removeDesig(deleteItem.id);
    setDeleteOpen(false);
  };

  const branchColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "location", label: "Location" },
    {
      key: "createdAt",
      label: "Created",
      render: (b: Branch) => format(new Date(b.createdAt), "MMM dd, yyyy"),
    },
  ];

  const departmentColumns = [
    { key: "name", label: "Name", sortable: true },
    {
      key: "branchId",
      label: "Branch",
      render: (d: Department) =>
        branches.find((b) => b.id === d.branchId)?.name || "N/A",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (d: Department) => format(new Date(d.createdAt), "MMM dd, yyyy"),
    },
  ];

  const designationColumns = [
    { key: "title", label: "Title", sortable: true },
    { key: "level", label: "Level" },
    {
      key: "departmentId",
      label: "Department",
      render: (d: Designation) =>
        departments.find((dept) => dept.id === d.departmentId)?.name || "N/A",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Organization</h1>
        <p className="subtle-text mt-1">
          Manage branches, departments, and designations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branches</p>
                <p className="text-2xl font-bold">{branches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
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
                <p className="text-sm text-muted-foreground">Designations</p>
                <p className="text-2xl font-bold">{designations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <MapPin className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Locations</p>
                <p className="text-2xl font-bold">
                  {
                    new Set(
                      branches.map((b) => b.location.split(",")[1]?.trim()),
                    ).size
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
        </TabsList>

        <TabsContent value="branches">
          <DataTable
            title="All Branches"
            data={branches}
            columns={branchColumns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Search branches..."
            addLabel="Add Branch"
          />
        </TabsContent>

        <TabsContent value="departments">
          <DataTable
            title="All Departments"
            data={departments}
            columns={departmentColumns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Search departments..."
            addLabel="Add Department"
          />
        </TabsContent>

        <TabsContent value="designations">
          <DataTable
            title="All Designations"
            data={designations}
            columns={designationColumns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Search designations..."
            addLabel="Add Designation"
          />
        </TabsContent>
      </Tabs>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={
          editingItem
            ? `Edit ${activeTab.slice(0, -1)}`
            : `Add New ${activeTab.slice(0, -1)}`
        }
        fields={
          activeTab === "branches"
            ? branchFields
            : activeTab === "departments"
              ? departmentFields
              : designationFields
        }
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${activeTab.slice(0, -1)}`}
        description={`Are you sure you want to delete "${deleteItem?.name || deleteItem?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Organization;
