import { SessionProduct } from "@/types/pos";
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface InventoryManagementProps {
  products: SessionProduct[];
  onUpdateStock: (productId: number, newInitialStock: number) => void;
}

export function InventoryManagement({ products, onUpdateStock }: InventoryManagementProps) {
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    console.log('Products updated in InventoryManagement:', products);
  }, [products]);

  const handleStockChange = (productId: number, value: string) => {
    const newStock = parseInt(value) || 0;
    setStockUpdates(prev => ({
      ...prev,
      [productId]: newStock
    }));
  };

  const handleUpdateStock = async (productId: number) => {
    const newInitialStock = stockUpdates[productId];
    if (newInitialStock !== undefined) {
      try {
        console.log('Starting stock update for product:', productId, 'new initial stock:', newInitialStock);

        const { error: updateError } = await supabase
          .from('products')
          .update({
            initial_stock: newInitialStock
          })
          .eq('id', productId);

        if (updateError) throw updateError;

        onUpdateStock(productId, newInitialStock);

        toast({
          title: "Stock Updated",
          description: "Initial stock value has been updated successfully.",
        });

        setStockUpdates(prev => {
          const { [productId]: _, ...rest } = prev;
          return rest;
        });

      } catch (error: any) {
        console.error('Error updating stock:', error);
        toast({
          title: "Error",
          description: "Failed to update stock.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex-1 overflow-auto border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow className="hover:bg-background">
              <TableHead className="w-[250px]">Product Name</TableHead>
              <TableHead className="w-[120px]">Price</TableHead>
              <TableHead className="w-[150px]">Initial Stock</TableHead>
              <TableHead className="w-[150px]">Current Stock</TableHead>
              <TableHead className="w-[150px]">Update Initial</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  {product.name}
                </TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.initial_stock}</TableCell>
                <TableCell>{product.current_stock}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="New initial stock"
                    className="w-32"
                    onChange={(e) => handleStockChange(product.id, e.target.value)}
                    value={stockUpdates[product.id] || ''}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStock(product.id)}
                  >
                    Update Stock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}