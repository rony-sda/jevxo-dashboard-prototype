"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  FolderKanban,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Image,
} from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { mockPortfolioItems, PortfolioItem } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const CMSPortfolio = () => {
  const {
    data: items,
    create,
    update,
    remove,
  } = useCrudStore<PortfolioItem>({
    initialData: mockPortfolioItems,
    entityName: "Portfolio Item",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PortfolioItem | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const itemFields = [
    { key: "title", label: "Title", type: "text" as const, required: true },
    {
      key: "description",
      label: "Description",
      type: "textarea" as const,
      required: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: [
        { value: "Web Development", label: "Web Development" },
        { value: "Mobile Development", label: "Mobile Development" },
        { value: "UI/UX Design", label: "UI/UX Design" },
        { value: "Branding", label: "Branding" },
      ],
    },
    { key: "client", label: "Client", type: "text" as const },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
      ],
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormValues({ status: "draft", images: [], createdAt: new Date() });
    setFormOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormValues(item);
    setFormOpen(true);
  };

  const handleDelete = (item: PortfolioItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      images: formValues.images || [],
      createdAt: editingItem?.createdAt || new Date(),
    };
    if (editingItem) {
      update(editingItem.id, submitValues);
    } else {
      create(submitValues as Omit<PortfolioItem, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      remove(deleteItem.id);
    }
    setDeleteOpen(false);
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const publishedItems = items.filter((i) => i.status === "published").length;
  const categories = [...new Set(items.map((i) => i.category))].length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Portfolio</h1>
        <p className="subtle-text mt-1">Showcase your work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
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
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{publishedItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <FolderKanban className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <Image className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">
                  {items.length - publishedItems}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search portfolio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <FolderKanban className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{item.category}</Badge>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              {item.client && (
                <p className="text-xs text-muted-foreground mt-2">
                  Client: {item.client}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-xs text-muted-foreground">
                {format(new Date(item.createdAt), "MMM dd, yyyy")}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(item)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item)}
                  className="text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingItem ? "Edit Portfolio Item" : "Add New Item"}
        fields={itemFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Portfolio Item"
        description={`Are you sure you want to delete "${deleteItem?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CMSPortfolio;
