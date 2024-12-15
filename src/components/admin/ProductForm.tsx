import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ProductFormProps {
  productId: number;
  initialStock: number;
  currentStock: number;
  onStockUpdate: (newInitialStock: number, newCurrentStock: number) => void;
}

export function ProductForm({ productId, initialStock, currentStock, onStockUpdate }: ProductFormProps) {
  const [newInitialStock, setNewInitialStock] = useState(initialStock.toString());
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedNewStock = parseInt(newInitialStock);
    if (isNaN(parsedNewStock) || parsedNewStock < 0) {
      toast({
        title: "Invalid stock value",
        description: "Please enter a valid number for initial stock",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate the difference between old and new initial stock
      const stockDifference = parsedNewStock - initialStock;
      // Add this difference to the current stock
      const newCurrentStock = currentStock + stockDifference;

      const { error } = await supabase
        .from('products')
        .update({ 
          initial_stock: parsedNewStock,
          current_stock: newCurrentStock
        })
        .eq('id', productId);

      if (error) throw error;

      onStockUpdate(parsedNewStock, newCurrentStock);
      
      toast({
        title: "Stock updated",
        description: "Product stock has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="initialStock">Initial Stock</Label>
        <Input
          id="initialStock"
          type="number"
          value={newInitialStock}
          onChange={(e) => setNewInitialStock(e.target.value)}
          min="0"
        />
      </div>
      <div className="space-y-2">
        <Label>Current Stock</Label>
        <p className="text-sm text-muted-foreground">{currentStock}</p>
      </div>
      <Button type="submit" className="w-full">
        Update Stock
      </Button>
    </form>
  );
}