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
  onUpdateStock: (productId: number, newInitialStock: number, newCurrentStock: number) => void;
}

export function InventoryManagement({ products, onUpdateStock }: InventoryManagementProps) {
  const [initialStockUpdates, setInitialStockUpdates] = useState<Record<number, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    console.log('Products updated in InventoryManagement:', products);
  }, [products]);

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
        console.log('Starting stock update for product:', productId, 'new initial stock:', newInitialStock);

        // Calculate new current stock
        const { data: newCurrentStock, error: rpcError } = await supabase
          .rpc('calculate_new_current_stock', {
            product_id: productId,
            new_initial_stock: newInitialStock
          });

        if (rpcError) throw rpcError;

        console.log('Calculated new current stock:', newCurrentStock);

        // Update both initial and current stock in the products table
        const { error: updateError } = await supabase
          .from('products')
          .update({
            initial_stock: newInitialStock,
            current_stock: newCurrentStock
          })
          .eq('id', productId);

        if (updateError) throw updateError;

        // Update the session's products array
        const sessionId = products[0]?.id;
        const { error: sessionError } = await supabase
          .from('sessions')
          .update({
            products: products.map(p => 
              p.id === productId 
                ? { ...p, initial_stock: newInitialStock, current_stock: newCurrentStock }
                : p
            )
          })
          .eq('id', sessionId);

        if (sessionError) throw sessionError;

        console.log('Database updates successful');

        // Call onUpdateStock with both initial and current stock values
        onUpdateStock(productId, newInitialStock, newCurrentStock);

        toast({
          title: "Stock Updated",
          description: "Initial and current stock have been updated successfully.",
        });

        // Clear the input field after successful update
        setInitialStockUpdates(prev => {
          const { [productId]: _, ...rest } = prev;
          return rest;
        });

      } catch (error) {
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
              <TableHead className="w-[180px]">Update Initial Stock</TableHead>
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
    </div>
  );
}