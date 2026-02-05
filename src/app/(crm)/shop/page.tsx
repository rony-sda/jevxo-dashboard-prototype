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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  Package,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useCrudStore } from "@/hooks/use-cardstore";
import {
  getClientById,
  mockShopOrders,
  mockShopProducts,
  ShopOrder,
  ShopProduct,
} from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { FormDialog } from "@/components/shared/form-dialog";
import { DeleteDialog } from "@/components/shared/delete-dialog";

const Shop = () => {
  const {
    data: products,
    create: createProduct,
    update: updateProduct,
    remove: removeProduct,
  } = useCrudStore<ShopProduct>({
    initialData: mockShopProducts,
    entityName: "Product",
  });

  const { data: orders } = useCrudStore<ShopOrder>({
    initialData: mockShopOrders,
    entityName: "Order",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(
    null,
  );
  const [deleteProduct, setDeleteProduct] = useState<ShopProduct | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const productFields = [
    {
      key: "name",
      label: "Product Name",
      type: "text" as const,
      required: true,
    },
    {
      key: "description",
      label: "Description",
      type: "textarea" as const,
      required: true,
    },
    {
      key: "price",
      label: "Price ($)",
      type: "number" as const,
      required: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: [
        { value: "Services", label: "Services" },
        { value: "Development", label: "Development" },
        { value: "Consulting", label: "Consulting" },
      ],
    },
    { key: "stock", label: "Stock", type: "number" as const, required: true },
  ];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormValues({ isActive: true, imageUrl: "/placeholder.svg" });
    setFormOpen(true);
  };

  const handleEditProduct = (product: ShopProduct) => {
    setEditingProduct(product);
    setFormValues(product);
    setFormOpen(true);
  };

  const handleDeleteProduct = (product: ShopProduct) => {
    setDeleteProduct(product);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formValues);
    } else {
      createProduct(formValues as Omit<ShopProduct, "id">);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteProduct) {
      removeProduct(deleteProduct.id);
    }
    setDeleteOpen(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeProducts = products.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="module-header">Shop</h1>
        <p className="subtle-text mt-1">Manage products and orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <ShoppingBag className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <ShoppingBag className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button onClick={handleAddProduct} className="gap-2">
              <Plus size={16} />
              Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product)}
                        className="text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {getClientById(order.clientId)?.name ||
                          "Unknown Client"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ${order.total.toLocaleString()}
                      </p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        fields={productFields}
        values={formValues}
        onChange={(key, value) =>
          setFormValues((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Shop;
