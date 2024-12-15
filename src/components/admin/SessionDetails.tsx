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

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
}

export function SessionDetails({ session, onUpdateStock }: SessionDetailsProps) {
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});

  const handleStockChange = (productId: number, value: string) => {
    const newStock = parseInt(value) || 0;
    setStockUpdates((prev) => ({ ...prev, [productId]: newStock }));
  };

  const handleStockUpdate = (productId: number) => {
    const newStock = stockUpdates[productId];
    if (newStock !== undefined) {
      onUpdateStock(productId, newStock);
      // Clear the update for this product
      setStockUpdates((prev) => {
        const { [productId]: _, ...rest } = prev;
        return rest;
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
                <TableHead>Product</TableHead>
                <TableHead>Initial Stock</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Update Stock</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.initialStock}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={
                        stockUpdates[product.id] !== undefined
                          ? stockUpdates[product.id]
                          : ""
                      }
                      onChange={(e) =>
                        handleStockChange(product.id, e.target.value)
                      }
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStockUpdate(product.id)}
                      disabled={stockUpdates[product.id] === undefined}
                    >
                      Update
                    </Button>
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