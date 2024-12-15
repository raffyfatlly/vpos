import { useState, useEffect } from "react";
import { SessionProduct } from "@/types/pos";
import { formatPrice } from "@/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InventoryTableProps {
  products: SessionProduct[];
  onUpdateStock: (productId: number, newInitialStock: number) => void;
}

export function InventoryTable({ products: initialProducts, onUpdateStock }: InventoryTableProps) {
  const [products, setProducts] = useState<SessionProduct[]>(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Subscribe to real-time product updates
  useEffect(() => {
    const channel = supabase
      .channel('inventory_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        async (payload) => {
          console.log('Product update received in InventoryTable:', payload);
          
          if (payload.new && 'id' in payload.new) {
            const updatedProduct = payload.new as SessionProduct;
            
            setProducts(currentProducts => 
              currentProducts.map(product =>
                product.id === updatedProduct.id
                  ? {
                      ...product,
                      initial_stock: updatedProduct.initial_stock,
                      current_stock: updatedProduct.current_stock
                    }
                  : product
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Initial Stock</TableHead>
          <TableHead>Current Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category || '-'}</TableCell>
            <TableCell>{formatPrice(Number(product.price))}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={product.initial_stock}
                  onChange={(e) => onUpdateStock(product.id, parseInt(e.target.value))}
                  className="w-20 p-1 border rounded"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStock(product.id, product.initial_stock)}
                >
                  Update
                </Button>
              </div>
            </TableCell>
            <TableCell>{product.current_stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}