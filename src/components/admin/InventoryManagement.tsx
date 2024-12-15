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

interface InventoryManagementProps {
  products: SessionProduct[];
  onUpdateStock: (productId: number, newInitialStock: number) => void;
}

const MAX_INTEGER = 2147483647; // PostgreSQL integer maximum value

export function InventoryManagement({ products, onUpdateStock }: InventoryManagementProps) {
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});
  const { toast } = useToast();

  // Initialize stockUpdates with current initial_stock values
  useEffect(() => {
    const initialValues: Record<number, number> = {};
    products.forEach(product => {
      initialValues[product.id] = product.initial_stock;
    });
    setStockUpdates(initialValues);
  }, [products]);

  const handleStockChange = (productId: number, value: string) => {
    const newStock = parseInt(value) || 0;
    
    // Validate the input value
    if (newStock > MAX_INTEGER) {
      toast({
        title: "Invalid stock value",
        description: "The stock value is too large. Maximum allowed value is 2,147,483,647.",
        variant: "destructive",
      });
      return;
    }

    setStockUpdates(prev => ({
      ...prev,
      [productId]: newStock
    }));
  };

  const handleUpdateStock = async (productId: number) => {
    const newInitialStock = stockUpdates[productId];
    if (newInitialStock !== undefined) {
      // Additional validation before update
      if (newInitialStock > MAX_INTEGER) {
        toast({
          title: "Invalid stock value",
          description: "The stock value is too large. Maximum allowed value is 2,147,483,647.",
          variant: "destructive",
        });
        return;
      }

      try {
        await onUpdateStock(productId, newInitialStock);

        toast({
          title: "Stock Updated",
          description: "Initial stock value has been updated successfully.",
        });
      } catch (error: any) {
        console.error('Error updating stock:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update stock.",
          variant: "destructive",
        });
      }
    }
  };

  // Add console logs to debug the values
  console.log('Products received:', products);
  console.log('Current stock updates state:', stockUpdates);

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
              <TableHead className="w-[150px]">Update Initial Stock</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              // Debug log for each product
              console.log(`Product ${product.id} initial_stock:`, product.initial_stock);
              console.log(`Product ${product.id} stockUpdates value:`, stockUpdates[product.id]);
              
              return (
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
                      className="w-32"
                      onChange={(e) => handleStockChange(product.id, e.target.value)}
                      value={stockUpdates[product.id] ?? product.initial_stock}
                      max={MAX_INTEGER}
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}