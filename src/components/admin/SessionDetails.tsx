import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Session, SessionProduct, SessionInventory } from "@/types/pos";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (sessionId: string, updatedProducts: SessionProduct[]) => void;
}

export function SessionDetails({ session, onUpdateStock }: SessionDetailsProps) {
  const [products, setProducts] = useState(session.products);
  const { toast } = useToast();

  // Fetch initial session inventory data
  useEffect(() => {
    const fetchSessionInventory = async () => {
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('session_inventory')
        .select('*')
        .eq('session_id', session.id);

      if (inventoryError) {
        console.error('Error fetching session inventory:', inventoryError);
        return;
      }

      // Map inventory data to products
      const updatedProducts = products.map(product => {
        const inventory = inventoryData?.find(inv => inv.product_id === product.id);
        if (inventory) {
          return {
            ...product,
            initial_stock: inventory.initial_stock,
            current_stock: inventory.current_stock,
          };
        }
        return product;
      });

      setProducts(updatedProducts);
      onUpdateStock(session.id, updatedProducts);
    };

    fetchSessionInventory();
  }, [session.id]);

  // Subscribe to real-time updates for this session's inventory
  useEffect(() => {
    const channel = supabase
      .channel(`session_inventory_${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_inventory',
          filter: `session_id=eq.${session.id}`,
        },
        async (payload: any) => {
          console.log('Received session inventory update:', payload);
          
          // Fetch updated inventory data for this session
          const { data: inventoryData, error: inventoryError } = await supabase
            .from('session_inventory')
            .select('*')
            .eq('session_id', session.id);

          if (inventoryError) {
            console.error('Error fetching updated inventory:', inventoryError);
            return;
          }

          // Update products with new inventory data
          const updatedProducts = products.map(product => {
            const inventory = inventoryData?.find(inv => inv.product_id === product.id);
            if (inventory) {
              return {
                ...product,
                initial_stock: inventory.initial_stock,
                current_stock: inventory.current_stock,
              };
            }
            return product;
          });

          setProducts(updatedProducts);
          onUpdateStock(session.id, updatedProducts);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id, products]);

  const handleInitialStockChange = async (productId: number, newInitialStock: number) => {
    try {
      // First check if a record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('session_inventory')
        .select('*')
        .eq('session_id', session.id)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw checkError;
      }

      let updateError;
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('session_inventory')
          .update({
            initial_stock: newInitialStock,
            current_stock: newInitialStock
          })
          .eq('session_id', session.id)
          .eq('product_id', productId);
        
        updateError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('session_inventory')
          .insert({
            session_id: session.id,
            product_id: productId,
            initial_stock: newInitialStock,
            current_stock: newInitialStock
          });
        
        updateError = error;
      }

      if (updateError) throw updateError;

      // Update local state
      const updatedProducts = products.map(product =>
        product.id === productId
          ? {
              ...product,
              initial_stock: newInitialStock,
              current_stock: newInitialStock
            }
          : product
      );

      setProducts(updatedProducts);
      onUpdateStock(session.id, updatedProducts);

      toast({
        title: "Stock updated",
        description: "Initial and current stock have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating session stock:', error);
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
          <h3 className="text-lg font-medium">Session Inventory</h3>
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