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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface InventoryManagementProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
}

export function InventoryManagement({ session }: InventoryManagementProps) {
  const [initialStockUpdates, setInitialStockUpdates] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

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
        const { error } = await supabase
          .from('products')
          .update({ 
            initial_stock: newInitialStock,
            // Update current_stock by the difference in initial stock
            current_stock: supabase.rpc('calculate_new_current_stock', {
              product_id: productId,
              new_initial_stock: newInitialStock
            })
          })
          .eq('id', productId);

        if (error) throw error;

        toast({
          title: "Stock Updated",
          description: "Initial stock has been updated successfully.",
        });

        // Clear the input after update
        setInitialStockUpdates(prev => {
          const { [productId]: _, ...rest } = prev;
          return rest;
        });

        // Refresh the products list
        refetch();
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

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Initial Stock</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Update Initial Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
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