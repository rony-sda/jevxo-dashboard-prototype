"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Edit3, Tag } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { BlogPost, mockBlogPosts } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const CMSBlog = () => {
  const {
    data: posts,
    create,
    update,
    remove,
  } = useCrudStore<BlogPost>({
    initialData: mockBlogPosts,
    entityName: "Blog Post",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const postFields = [
    { key: "title", label: "Title", type: "text" as const, required: true },
    { key: "slug", label: "URL Slug", type: "text" as const, required: true },
    {
      key: "excerpt",
      label: "Excerpt",
      type: "textarea" as const,
      required: true,
    },
    {
      key: "content",
      label: "Content",
      type: "textarea" as const,
      required: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: [
        { value: "News", label: "News" },
        { value: "Tutorials", label: "Tutorials" },
        { value: "Business", label: "Business" },
        { value: "Technology", label: "Technology" },
      ],
    },
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
    { key: "author", label: "Author", type: "text" as const, required: true },
  ];

  const handleAdd = () => {
    setEditingPost(null);
    setFormValues({
      status: "draft",
      author: "Admin",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setFormOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormValues(post);
    setFormOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setDeletePost(post);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      tags: formValues.tags || [],
      updatedAt: new Date(),
      createdAt: editingPost?.createdAt || new Date(),
    };
    if (editingPost) {
      update(editingPost.id, submitValues);
    } else {
      create(submitValues as Omit<BlogPost, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletePost) {
      remove(deletePost.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "category",
      label: "Category",
      render: (post: BlogPost) => (
        <Badge variant="outline">{post.category}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (post: BlogPost) => <StatusBadge status={post.status} />,
    },
    { key: "author", label: "Author" },
    {
      key: "createdAt",
      label: "Created",
      render: (post: BlogPost) =>
        format(new Date(post.createdAt), "MMM dd, yyyy"),
    },
  ];

  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const categories = [...new Set(posts.map((p) => p.category))].length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Blog Posts</h1>
        <p className="subtle-text mt-1">Manage blog content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{posts.length}</p>
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
                <p className="text-2xl font-bold">{publishedPosts}</p>
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
                <p className="text-2xl font-bold">{draftPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Tag className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Blog Posts"
        data={posts}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search posts..."
        addLabel="Create Post"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingPost ? "Edit Blog Post" : "Create New Post"}
        fields={postFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deletePost?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CMSBlog;
