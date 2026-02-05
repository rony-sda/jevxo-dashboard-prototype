"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast } from "sonner";
import {
  Shield,
  Users,
  UserCog,
  Briefcase,
  UserCheck,
  Save,
} from "lucide-react";
import { useCrudStore } from "@/hooks/use-cardstore";
import { mockRolePermissions, RolePermission } from "@/data/mock-data";

const roleIcons = {
  admin: <Shield className="h-5 w-5" />,
  editor: <UserCog className="h-5 w-5" />,
  manager: <Briefcase className="h-5 w-5" />,
  hr: <Users className="h-5 w-5" />,
  partner: <UserCheck className="h-5 w-5" />,
  client: <Users className="h-5 w-5" />,
};

const roleDescriptions = {
  admin: "Full access to all features and settings",
  editor: "Can manage content and CMS features",
  manager: "Can manage CRM and team-level HRM features",
  hr: "Can manage HR operations and partner onboarding",
  partner: "Limited access to assigned projects and personal data",
  client: "View-only access to their own projects and invoices",
};

const modules = ["cms", "crm", "hrm"];

const RoleManagement = () => {
  const { data: permissions, update } = useCrudStore<RolePermission>({
    initialData: mockRolePermissions,
    entityName: "Permission",
  });

  const [localPermissions, setLocalPermissions] = useState(permissions);

  const handleToggle = (
    id: string,
    field: "canView" | "canCreate" | "canEdit" | "canDelete",
    value: boolean,
  ) => {
    setLocalPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = (role: string) => {
    const rolePermissions = localPermissions.filter((p) => p.role === role);
    rolePermissions.forEach((p) => {
      const original = permissions.find((op) => op.id === p.id);
      if (
        original &&
        (original.canView !== p.canView ||
          original.canCreate !== p.canCreate ||
          original.canEdit !== p.canEdit ||
          original.canDelete !== p.canDelete)
      ) {
        update(p.id, p);
      }
    });
    toast("Permissions saved", {
      description: `${role.charAt(0).toUpperCase() + role.slice(1)} permissions have been updated.`,
    });
  };

  const roles = [
    "admin",
    "editor",
    "manager",
    "hr",
    "partner",
    "client",
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Role Management</h1>
        <p className="subtle-text mt-1">Configure role-based access control</p>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {roles.map((role) => (
          <Card key={role}>
            <CardContent className="py-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-xl bg-primary/20 mb-3">
                  {roleIcons[role]}
                </div>
                <p className="font-medium capitalize">{role}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {localPermissions.filter((p) => p.role === role).length}{" "}
                  modules
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="admin" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          {roles.map((role) => (
            <TabsTrigger key={role} value={role} className="capitalize gap-2">
              {roleIcons[role]}
              {role}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => (
          <TabsContent key={role} value={role}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize flex items-center gap-2">
                      {roleIcons[role]}
                      {role} Role
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {roleDescriptions[role]}
                    </p>
                  </div>
                  <Button onClick={() => handleSave(role)} className="gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {modules.map((module) => {
                    const permission = localPermissions.find(
                      (p) => p.role === role && p.module === module,
                    );
                    if (!permission) return null;

                    return (
                      <div
                        key={module}
                        className="p-4 rounded-lg bg-secondary/30"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <Badge variant="outline" className="uppercase">
                              {module}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {module === "cms" && "Content Management System"}
                              {module === "crm" &&
                                "Customer Relationship Management"}
                              {module === "hrm" && "Human Resource Management"}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-sm">View</span>
                            <Switch
                              checked={permission.canView}
                              onCheckedChange={(v) =>
                                handleToggle(permission.id, "canView", v)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-sm">Create</span>
                            <Switch
                              checked={permission.canCreate}
                              onCheckedChange={(v) =>
                                handleToggle(permission.id, "canCreate", v)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-sm">Edit</span>
                            <Switch
                              checked={permission.canEdit}
                              onCheckedChange={(v) =>
                                handleToggle(permission.id, "canEdit", v)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-sm">Delete</span>
                            <Switch
                              checked={permission.canDelete}
                              onCheckedChange={(v) =>
                                handleToggle(permission.id, "canDelete", v)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RoleManagement;
