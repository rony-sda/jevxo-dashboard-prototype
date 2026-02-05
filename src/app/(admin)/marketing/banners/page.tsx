"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Eye, EyeOff, Layout } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { Banner, mockBanners } from "@/data/mock-data";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const MarketingBanners = () => {
  const {
    data: banners,
    create,
    update,
    remove,
  } = useCrudStore<Banner>({
    initialData: mockBanners,
    entityName: "Banner",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const bannerFields = [
    { key: "title", label: "Title", type: "text" as const, required: true },
    { key: "subtitle", label: "Subtitle", type: "text" as const },
    {
      key: "imageUrl",
      label: "Image URL",
      type: "text" as const,
      required: true,
    },
    { key: "linkUrl", label: "Link URL", type: "text" as const },
    {
      key: "position",
      label: "Position",
      type: "select" as const,
      required: true,
      options: [
        { value: "hero", label: "Hero" },
        { value: "sidebar", label: "Sidebar" },
        { value: "footer", label: "Footer" },
      ],
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date" as const,
      required: true,
    },
    { key: "endDate", label: "End Date", type: "date" as const },
  ];

  const handleAdd = () => {
    setEditingBanner(null);
    setFormValues({
      isActive: true,
      imageUrl: "/placeholder.svg",
      startDate: new Date(),
    });
    setFormOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormValues({
      ...banner,
      startDate: format(new Date(banner.startDate), "yyyy-MM-dd"),
      endDate: banner.endDate
        ? format(new Date(banner.endDate), "yyyy-MM-dd")
        : "",
    });
    setFormOpen(true);
  };

  const handleDelete = (banner: Banner) => {
    setDeleteBanner(banner);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      isActive: true,
      startDate: new Date(formValues.startDate),
      endDate: formValues.endDate ? new Date(formValues.endDate) : undefined,
    };
    if (editingBanner) {
      update(editingBanner.id, submitValues);
    } else {
      create(submitValues as Omit<Banner, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteBanner) {
      remove(deleteBanner.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "subtitle", label: "Subtitle" },
    {
      key: "position",
      label: "Position",
      render: (banner: Banner) => (
        <Badge variant="outline" className="capitalize">
          {banner.position}
        </Badge>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (banner: Banner) => (
        <Badge
          variant={banner.isActive ? "default" : "secondary"}
          className={banner.isActive ? "bg-success/20 text-success" : ""}
        >
          {banner.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (banner: Banner) =>
        format(new Date(banner.startDate), "MMM dd, yyyy"),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (banner: Banner) =>
        banner.endDate
          ? format(new Date(banner.endDate), "MMM dd, yyyy")
          : "No end date",
    },
  ];

  const activeBanners = banners.filter((b) => b.isActive).length;
  const heroBanners = banners.filter((b) => b.position === "hero").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Banners</h1>
        <p className="subtle-text mt-1">Manage promotional banners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Banners</p>
                <p className="text-2xl font-bold">{banners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Eye className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeBanners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Layout className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hero Banners</p>
                <p className="text-2xl font-bold">{heroBanners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted">
                <EyeOff className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">
                  {banners.length - activeBanners}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Banners"
        data={banners}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search banners..."
        addLabel="Create Banner"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingBanner ? "Edit Banner" : "Create New Banner"}
        fields={bannerFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Banner"
        description={`Are you sure you want to delete "${deleteBanner?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MarketingBanners;
