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

interface InventoryManagementProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
}

export function InventoryManagement({ session, onUpdateStock }: InventoryManagementProps) {
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});

  const { data: products, isLoading } = useQuery({
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

  const handleStockChange = (productId: number, value: string) => {
    const newStock = parseInt(value) || 0;
    setStockUpdates(prev => ({
      ...prev,
      [productId]: newStock
    }));
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
            <TableHead>Update Stock</TableHead>
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
                  placeholder="New stock count"
                  className="w-24"
                  onChange={(e) => handleStockChange(product.id, e.target.value)}
                  value={stockUpdates[product.id] || ''}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newStock = stockUpdates[product.id];
                    if (typeof newStock === 'number') {
                      onUpdateStock(product.id, newStock);
                      // Clear the input after update
                      setStockUpdates(prev => {
                        const { [product.id]: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                >
                  Update Stock
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}