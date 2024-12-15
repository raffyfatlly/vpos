import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Session, SessionProduct } from "@/types/pos";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (sessionId: string, updatedProducts: SessionProduct[]) => void;
}

export function SessionDetails({ session, onUpdateStock }: SessionDetailsProps) {
  const [products, setProducts] = useState(session.products);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`session_${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.products) {
            setProducts(payload.new.products);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id]);

  const handleInitialStockChange = async (productId: number, newInitialStock: number) => {
    try {
      // Update products array with new initial and current stock
      const updatedProducts = products.map((product: SessionProduct) =>
        product.id === productId
          ? { 
              ...product,
              initial_stock: newInitialStock,
              current_stock: newInitialStock // Set current_stock equal to initial_stock
            }
          : product
      );

      // Update session in database
      const { error } = await supabase
        .from('sessions')
        .update({
          products: updatedProducts
        })
        .eq('id', session.id);

      if (error) throw error;

      // Update local state
      setProducts(updatedProducts);
      
      // Notify parent component with session ID and updated products
      onUpdateStock(session.id, updatedProducts);

      toast({
        title: "Stock updated",
        description: "Initial and current stock have been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border">
        <div className="p-4">
          <h3 className="text-lg font-medium">Inventory</h3>
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-4 font-medium text-sm text-gray-500 mb-2">
              <div>Product</div>
              <div>Initial Stock</div>
              <div>Current Stock</div>
              <div>Actions</div>
            </div>
            {products.map((product: SessionProduct) => (
              <div key={product.id} className="grid grid-cols-4 gap-4 py-2 border-t items-center">
                <div>{product.name}</div>
                <div>
                  <Input
                    type="number"
                    min="0"
                    value={product.initial_stock || 0}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      handleInitialStockChange(product.id, newValue);
                    }}
                    className="w-24"
                  />
                </div>
                <div>{product.current_stock || 0}</div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInitialStockChange(product.id, product.initial_stock || 0)}
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}