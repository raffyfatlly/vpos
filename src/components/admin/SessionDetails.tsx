import { useState } from "react";
import { Session, Sale } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
  onUpdateProduct: (productId: number, updates: { price?: number; name?: string }) => void;
}

export function SessionDetails({ 
  session, 
  onUpdateStock, 
  onUpdateProduct 
}: SessionDetailsProps) {
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});
  const [productUpdates, setProductUpdates] = useState<Record<number, { price?: string; name?: string }>>({});
  const { toast } = useToast();

  const handleStockChange = (productId: number, value: string) => {
    const newStock = parseInt(value) || 0;
    setStockUpdates((prev) => ({ ...prev, [productId]: newStock }));
  };

  const handleProductChange = (productId: number, field: 'price' | 'name', value: string) => {
    setProductUpdates((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value }
    }));
  };

  const handleStockUpdate = (productId: number) => {
    const newStock = stockUpdates[productId];
    if (newStock !== undefined) {
      onUpdateStock(productId, newStock);
      setStockUpdates((prev) => {
        const { [productId]: _, ...rest } = prev;
        return rest;
      });
      toast({
        title: "Stock Updated",
        description: "Product stock has been successfully updated.",
      });
    }
  };

  const handleProductUpdate = (productId: number) => {
    const updates = productUpdates[productId];
    if (updates) {
      const parsedUpdates = {
        ...(updates.name && { name: updates.name }),
        ...(updates.price && { price: parseFloat(updates.price) }),
      };
      onUpdateProduct(productId, parsedUpdates);
      setProductUpdates((prev) => {
        const { [productId]: _, ...rest } = prev;
        return rest;
      });
      toast({
        title: "Product Updated",
        description: "Product details have been successfully updated.",
      });
    }
  };

  const calculateTotalSales = () => {
    return session.sales?.reduce((total, sale) => total + sale.total, 0) || 0;
  };

  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList>
        <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
        <TabsTrigger value="sales">Sales Overview</TabsTrigger>
        <TabsTrigger value="history">Sales History</TabsTrigger>
      </TabsList>

      <TabsContent value="inventory" className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Initial Stock</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Update Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Input
                      value={productUpdates[product.id]?.name ?? product.name}
                      onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={productUpdates[product.id]?.price ?? product.price}
                      onChange={(e) => handleProductChange(product.id, 'price', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>{product.initialStock}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : ""}
                      onChange={(e) => handleStockChange(product.id, e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStockUpdate(product.id)}
                        disabled={stockUpdates[product.id] === undefined}
                      >
                        Update Stock
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProductUpdate(product.id)}
                        disabled={!productUpdates[product.id]}
                      >
                        Update Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="sales" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Total Sales</h3>
            <p className="text-2xl">${calculateTotalSales().toFixed(2)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Total Transactions</h3>
            <p className="text-2xl">{session.sales?.length || 0}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.sales?.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>
                    {new Date(sale.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{sale.products.length} items</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}