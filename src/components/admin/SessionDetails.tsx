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
        async () => {
          // Fetch latest product data
          const { data: products } = await supabase
            .from('products')
            .select('*');

          if (products) {
            // Update session with latest product data, preserving initial_stock
            setSession(prevSession => ({
              ...prevSession,
              products: products.map(product => {
                const existingProduct = prevSession.products.find(p => p.id === product.id);
                return {
                  ...product,
                  session_id: prevSession.id,
                  // Preserve the initial_stock from the existing product if it exists
                  initial_stock: existingProduct?.initial_stock ?? product.initial_stock
                };
              })
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialSession]);

  const handleUpdateStock = async (productId: number, newInitialStock: number) => {
    console.log('Updating stock in SessionDetails:', { productId, newInitialStock });
    
    try {
      // Update the product in the database
      const { error: updateError } = await supabase
        .from('products')
        .update({
          initial_stock: newInitialStock,
          current_stock: newInitialStock // Set current_stock equal to initial_stock on update
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Fetch the updated product to ensure we have the latest data
      const { data: updatedProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      // Update local state with the fetched product data
      setSession(prevSession => ({
        ...prevSession,
        products: prevSession.products.map(product => 
          product.id === productId 
            ? { 
                ...updatedProduct, 
                session_id: prevSession.id,
                initial_stock: newInitialStock // Ensure initial_stock is set correctly
              } 
            : product
        )
      }));

      // Call the parent handler
      onUpdateStock(productId, newInitialStock);
    } catch (error) {
      console.error('Error updating stock:', error);
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