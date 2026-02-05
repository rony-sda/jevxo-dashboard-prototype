"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { Palette, Globe, CreditCard, Sparkles, Save } from "lucide-react";
import { useCrudStore } from "@/hooks/use-cardstore";
import { mockSystemSettings, SystemSetting } from "@/data/mock-data";

const SystemSettings = () => {
  const { data: settings, update } = useCrudStore<SystemSetting>({
    initialData: mockSystemSettings,
    entityName: "Setting",
  });

  const [localSettings, setLocalSettings] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.key, s.value])),
  );

  const handleChange = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (category: string) => {
    const categorySettings = settings.filter((s) => s.category === category);
    categorySettings.forEach((s) => {
      if (localSettings[s.key] !== s.value) {
        update(s.id, { value: localSettings[s.key] });
      }
    });
    toast("Settings saved", {
      description: `${category.charAt(0).toUpperCase() + category.slice(1)} settings have been updated.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">System Settings</h1>
        <p className="subtle-text mt-1">Configure system-wide settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-fit">
          <TabsTrigger value="general" className="gap-2">
            <Palette size={16} />
            General
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Globe size={16} />
            SEO
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard size={16} />
            Payments
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles size={16} />
            AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic site information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={localSettings.site_name || ""}
                    onChange={(e) => handleChange("site_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={localSettings.site_tagline || ""}
                    onChange={(e) =>
                      handleChange("site_tagline", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    value={localSettings.primary_color || ""}
                    onChange={(e) =>
                      handleChange("primary_color", e.target.value)
                    }
                    className="flex-1"
                  />
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{
                      backgroundColor: localSettings.primary_color || "#22d3ee",
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the site in maintenance mode
                  </p>
                </div>
                <Switch />
              </div>
              <Button onClick={() => handleSave("general")} className="gap-2">
                <Save size={16} />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Configure search engine optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={localSettings.meta_description || ""}
                  onChange={(e) =>
                    handleChange("meta_description", e.target.value)
                  }
                  placeholder="Default meta description for pages"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 150-160 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate XML sitemap
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Robots.txt</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow search engine indexing
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSave("seo")} className="gap-2">
                <Save size={16} />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment gateway integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Payment Gateway</Label>
                <Select
                  value={localSettings.payment_gateway || "stripe"}
                  onValueChange={(value) =>
                    handleChange("payment_gateway", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <Input id="api_key" type="password" placeholder="sk_live_..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook_secret">Webhook Secret</Label>
                <Input
                  id="webhook_secret"
                  type="password"
                  placeholder="whsec_..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Test Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use test/sandbox environment
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSave("payments")} className="gap-2">
                <Save size={16} />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Integration</CardTitle>
              <CardDescription>
                Configure OpenAI and AI features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select
                  value={localSettings.openai_model || "gpt-4"}
                  onValueChange={(value) => handleChange("openai_model", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai_key">OpenAI API Key</Label>
                <Input id="openai_key" type="password" placeholder="sk-..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_tokens">Max Tokens per Request</Label>
                <Input id="max_tokens" type="number" defaultValue={2000} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable AI Assistant</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable AI-powered features across the platform
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSave("ai")} className="gap-2">
                <Save size={16} />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
