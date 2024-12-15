import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SessionProduct } from "@/types/pos";

interface ProductFormProps {
  product?: SessionProduct | null;
  onSubmit: (productData: SessionProduct) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || '');
  const [initialStock, setInitialStock] = useState(product?.initial_stock?.toString() || '0');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedPrice = parseFloat(price);
    const parsedInitialStock = parseInt(initialStock);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(parsedInitialStock) || parsedInitialStock < 0) {
      toast({
        title: "Invalid stock value",
        description: "Please enter a valid number for initial stock",
        variant: "destructive",
      });
      return;
    }

    const productData: SessionProduct = {
      id: product?.id || 0,
      name,
      price: parsedPrice,
      category,
      initial_stock: parsedInitialStock,
      current_stock: parsedInitialStock,
      variations: product?.variations || []
    };

    await onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="initialStock">Initial Stock</Label>
        <Input
          id="initialStock"
          type="number"
          value={initialStock}
          onChange={(e) => setInitialStock(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}