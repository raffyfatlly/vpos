import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Session, SessionProduct } from "@/types/pos";
import { SalesOverview } from "@/components/admin/SalesOverview";
import { InventoryTable } from "@/components/admin/sessions/inventory/InventoryTable";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (sessionId: string, updatedProducts: SessionProduct[]) => void;
}

export function SessionDetails({ session, onUpdateStock }: SessionDetailsProps) {
  const [products, setProducts] = useState(session.products);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

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
          
          const { data: inventoryData, error: inventoryError } = await supabase
            .from('session_inventory')
            .select('*')
            .eq('session_id', session.id);

          if (inventoryError) {
            console.error('Error fetching updated inventory:', inventoryError);
            return;
          }

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
      const { data: existingRecord, error: checkError } = await supabase
        .from('session_inventory')
        .select('*')
        .eq('session_id', session.id)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let updateError;
      if (existingRecord) {
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
      <div className="text-sm text-muted-foreground mb-4">
        Session Date: {formatDate(session.date)}
      </div>
      <SalesOverview session={session} />
      <div className="rounded-lg border">
        <div className="p-4">
          <h3 className="text-lg font-medium">Session Inventory</h3>
          <InventoryTable 
            products={products}
            onInitialStockChange={handleInitialStockChange}
          />
        </div>
      </div>
    </div>
  );
}