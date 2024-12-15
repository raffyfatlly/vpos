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

        // First, update the products table
        const { error: updateError } = await supabase
          .from('products')
          .update({
            initial_stock: newInitialStock,
            current_stock: newInitialStock // Set current_stock equal to initial_stock on update
          })
          .eq('id', productId);

        if (updateError) throw updateError;

        // Find the current session ID from the products array
        const sessionId = products[0]?.session_id;
        if (!sessionId) {
          throw new Error('Session ID not found');
        }

        // Get the current session data
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('products')
          .eq('id', sessionId)
          .single();

        if (sessionError) throw sessionError;

        // Update the products array in the session
        const updatedProducts = sessionData.products.map((p: SessionProduct) =>
          p.id === productId
            ? { ...p, initial_stock: newInitialStock, current_stock: newInitialStock }
            : p
        );

        // Update the session with the new products array
        const { error: sessionUpdateError } = await supabase
          .from('sessions')
          .update({ products: updatedProducts })
          .eq('id', sessionId);

        if (sessionUpdateError) throw sessionUpdateError;

        console.log('Database updates successful');

        // Call onUpdateStock with both initial and current stock values
        onUpdateStock(productId, newInitialStock, newInitialStock);

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