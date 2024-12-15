import { useState, useEffect } from "react";
import { Session } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "./InventoryManagement";
import { SalesOverview } from "./SalesOverview";
import { SalesHistory } from "./SalesHistory";
import { supabase } from "@/lib/supabase";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newInitialStock: number) => void;
}

export function SessionDetails({ 
  session: initialSession, 
  onUpdateStock,
}: SessionDetailsProps) {
  const [session, setSession] = useState<Session>(initialSession);
  const [isUpdating, setIsUpdating] = useState(false);

  // Subscribe to product updates
  useEffect(() => {
    // First, sync with initial session data
    setSession(initialSession);

    // Then subscribe to product updates
    const channel = supabase
      .channel('product_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Product update received:', payload);
          
          // Skip if we're currently performing our own update
          if (isUpdating) return;

          // Only update if this is an UPDATE event
          if (payload.eventType === 'UPDATE') {
            const updatedProduct = payload.new;
            
            setSession(prevSession => {
              // Find if this product exists in our session
              const productExists = prevSession.products.some(p => p.id === updatedProduct.id);
              
              if (!productExists) return prevSession;

              // Update the product in our session with both initial and current stock
              const updatedProducts = prevSession.products.map(existingProduct => 
                existingProduct.id === updatedProduct.id
                  ? {
                      ...existingProduct,
                      initial_stock: updatedProduct.initial_stock,
                      current_stock: updatedProduct.current_stock
                    }
                  : existingProduct
              );

              return {
                ...prevSession,
                products: updatedProducts
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialSession, isUpdating]);

  const handleUpdateStock = async (productId: number, newInitialStock: number) => {
    console.log('Updating stock in SessionDetails:', { productId, newInitialStock });
    
    try {
      setIsUpdating(true);

      // Update the product in the database
      const { error: updateError } = await supabase
        .from('products')
        .update({
          initial_stock: newInitialStock,
          current_stock: newInitialStock // Set current_stock equal to initial_stock on update
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Update local state
      setSession(prevSession => ({
        ...prevSession,
        products: prevSession.products.map(product => 
          product.id === productId 
            ? { 
                ...product,
                initial_stock: newInitialStock,
                current_stock: newInitialStock // Update current_stock in local state as well
              } 
            : product
        )
      }));

      // Call the parent handler
      onUpdateStock(productId, newInitialStock);
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="inventory" className="flex-1">Inventory</TabsTrigger>
        <TabsTrigger value="overview" className="flex-1">Sales Overview</TabsTrigger>
        <TabsTrigger value="history" className="flex-1">Sales History</TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        <InventoryManagement 
          products={session.products} 
          onUpdateStock={handleUpdateStock}
        />
      </TabsContent>
      <TabsContent value="overview">
        <SalesOverview session={session} />
      </TabsContent>
      <TabsContent value="history">
        <SalesHistory session={session} />
      </TabsContent>
    </Tabs>
  );
}