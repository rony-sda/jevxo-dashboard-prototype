"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Globe, Archive, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { CMSPage, mockCMSPages } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const CMSPages = () => {
  const {
    data: pages,
    create,
    update,
    remove,
  } = useCrudStore<CMSPage>({
    initialData: mockCMSPages,
    entityName: "Page",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [deletePage, setDeletePage] = useState<CMSPage | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const pageFields = [
    {
      key: "title",
      label: "Page Title",
      type: "text" as const,
      required: true,
    },
    { key: "slug", label: "URL Slug", type: "text" as const, required: true },
    {
      key: "content",
      label: "Content (HTML)",
      type: "textarea" as const,
      required: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
      ],
    },
    { key: "author", label: "Author", type: "text" as const, required: true },
  ];

  const handleAdd = () => {
    setEditingPage(null);
    setFormValues({
      status: "draft",
      author: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setFormOpen(true);
  };

  const handleEdit = (page: CMSPage) => {
    setEditingPage(page);
    setFormValues(page);
    setFormOpen(true);
  };

  const handleDelete = (page: CMSPage) => {
    setDeletePage(page);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      updatedAt: new Date(),
      createdAt: editingPage?.createdAt || new Date(),
    };
    if (editingPage) {
      update(editingPage.id, submitValues);
    } else {
      create(submitValues as Omit<CMSPage, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletePage) {
      remove(deletePage.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "slug", label: "Slug", render: (page: CMSPage) => `/${page.slug}` },
    {
      key: "status",
      label: "Status",
      render: (page: CMSPage) => <StatusBadge status={page.status} />,
    },
    { key: "author", label: "Author" },
    {
      key: "updatedAt",
      label: "Last Updated",
      render: (page: CMSPage) =>
        format(new Date(page.updatedAt), "MMM dd, yyyy"),
    },
  ];

  const publishedPages = pages.filter((p) => p.status === "published").length;
  const draftPages = pages.filter((p) => p.status === "draft").length;
  const archivedPages = pages.filter((p) => p.status === "archived").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Pages</h1>
        <p className="subtle-text mt-1">Manage website pages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{pages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Globe className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{publishedPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <Edit3 className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{draftPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted">
                <Archive className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Archived</p>
                <p className="text-2xl font-bold">{archivedPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Pages"
        data={pages}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search pages..."
        addLabel="Create Page"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingPage ? "Edit Page" : "Create New Page"}
        fields={pageFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Page"
        description={`Are you sure you want to delete "${deletePage?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CMSPages;
