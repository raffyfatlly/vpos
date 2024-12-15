import { Session } from "@/types/pos";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InventoryManagementProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
}

export function InventoryManagement({ session }: InventoryManagementProps) {
  const [initialStockUpdates, setInitialStockUpdates] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const handleInitialStockChange = (productId: number, value: string) => {
    const newStock = parseInt(value) || 0;
    setInitialStockUpdates(prev => ({
      ...prev,
      [productId]: newStock
    }));
  };

  const handleUpdateInitialStock = async (productId: number) => {
    const newInitialStock = initialStockUpdates[productId];
    if (typeof newInitialStock === 'number') {
      try {
        // First, get the calculated new current stock
        const { data: newCurrentStock, error: rpcError } = await supabase
          .rpc('calculate_new_current_stock', {
            product_id: productId,
            new_initial_stock: newInitialStock
          });

        if (rpcError) throw rpcError;

        // Then update the product with both new values
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            initial_stock: newInitialStock,
            current_stock: newCurrentStock
          })
          .eq('id', productId);

        if (updateError) throw updateError;

        toast({
          title: "Stock Updated",
          description: "Initial stock has been updated successfully.",
        });

        // Clear the input after update
        setInitialStockUpdates(prev => {
          const { [productId]: _, ...rest } = prev;
          return rest;
        });
      } catch (error) {
        console.error('Error updating stock:', error);
        toast({
          title: "Error",
          description: "Failed to update initial stock.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="rounded-md border h-[calc(100vh-16rem)] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-1/4">Product Name</TableHead>
            <TableHead className="w-1/6">Price</TableHead>
            <TableHead className="w-1/6">Initial Stock</TableHead>
            <TableHead className="w-1/6">Current Stock</TableHead>
            <TableHead className="w-1/6">Update Initial Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {session.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.initial_stock}</TableCell>
              <TableCell>{product.current_stock}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="New initial stock"
                  className="w-24"
                  onChange={(e) => handleInitialStockChange(product.id, e.target.value)}
                  value={initialStockUpdates[product.id] || ''}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateInitialStock(product.id)}
                >
                  Update Initial Stock
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}