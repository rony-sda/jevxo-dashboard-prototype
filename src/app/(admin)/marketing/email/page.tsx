"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Send, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import { EmailCampaign, mockEmailCampaigns } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const MarketingEmail = () => {
  const {
    data: campaigns,
    create,
    update,
    remove,
  } = useCrudStore<EmailCampaign>({
    initialData: mockEmailCampaigns,
    entityName: "Email Campaign",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(
    null,
  );
  const [deleteCampaign, setDeleteCampaign] = useState<EmailCampaign | null>(
    null,
  );
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const campaignFields = [
    {
      key: "name",
      label: "Campaign Name",
      type: "text" as const,
      required: true,
    },
    {
      key: "subject",
      label: "Email Subject",
      type: "text" as const,
      required: true,
    },
    {
      key: "content",
      label: "Email Content",
      type: "textarea" as const,
      required: true,
    },
    {
      key: "recipients",
      label: "Number of Recipients",
      type: "number" as const,
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
        { value: "sent", label: "Sent" },
      ],
    },
  ];

  const handleAdd = () => {
    setEditingCampaign(null);
    setFormValues({ status: "draft", recipients: 0, createdAt: new Date() });
    setFormOpen(true);
  };

  const handleEdit = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setFormValues(campaign);
    setFormOpen(true);
  };

  const handleDelete = (campaign: EmailCampaign) => {
    setDeleteCampaign(campaign);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const submitValues = {
      ...formValues,
      createdAt: editingCampaign?.createdAt || new Date(),
    };
    if (editingCampaign) {
      update(editingCampaign.id, submitValues);
    } else {
      create(submitValues as Omit<EmailCampaign, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteCampaign) {
      remove(deleteCampaign.id);
    }
    setDeleteOpen(false);
  };

  const columns = [
    { key: "name", label: "Campaign", sortable: true },
    { key: "subject", label: "Subject" },
    {
      key: "status",
      label: "Status",
      render: (c: EmailCampaign) => <StatusBadge status={c.status} />,
    },
    {
      key: "recipients",
      label: "Recipients",
      render: (c: EmailCampaign) => c.recipients.toLocaleString(),
    },
    {
      key: "openRate",
      label: "Open Rate",
      render: (c: EmailCampaign) => (c.openRate ? `${c.openRate}%` : "-"),
    },
    {
      key: "clickRate",
      label: "Click Rate",
      render: (c: EmailCampaign) => (c.clickRate ? `${c.clickRate}%` : "-"),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (c: EmailCampaign) =>
        format(new Date(c.createdAt), "MMM dd, yyyy"),
    },
  ];

  const sentCampaigns = campaigns.filter((c) => c.status === "sent").length;
  const scheduledCampaigns = campaigns.filter(
    (c) => c.status === "scheduled",
  ).length;
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Email Campaigns</h1>
        <p className="subtle-text mt-1">Manage email marketing campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Send className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{sentCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Clock className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{scheduledCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <Users className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Recipients
                </p>
                <p className="text-2xl font-bold">
                  {totalRecipients.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All Campaigns"
        data={campaigns}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search campaigns..."
        addLabel="Create Campaign"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingCampaign ? "Edit Campaign" : "Create New Campaign"}
        fields={campaignFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${deleteCampaign?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MarketingEmail;
