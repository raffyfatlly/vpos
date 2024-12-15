import { useState, useEffect } from "react";
import { Session } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "./InventoryManagement";
import { SalesOverview } from "./SalesOverview";
import { SalesHistory } from "./SalesHistory";
import { supabase } from "@/lib/supabase";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newInitialStock: number) => void;
  onBack?: () => void;
}

export function SessionDetails({ 
  session: initialSession, 
  onUpdateStock,
  onBack
}: SessionDetailsProps) {
  const [session, setSession] = useState<Session>(initialSession);
  const [isUpdating, setIsUpdating] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // First, sync with initial session data
    setSession(initialSession);

    // Subscribe to both session and product updates
    const productsChannel = supabase
      .channel('product_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        async (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          console.log('Product update received:', payload);
          
          // Skip if we're currently performing our own update
          if (isUpdating) return;

          try {
            // Ensure payload.new exists and has an id
            if (!payload.new || typeof payload.new.id === 'undefined') {
              console.error('Invalid payload received:', payload);
              return;
            }

            // Fetch the latest product data
            const { data: updatedProduct, error: productError } = await supabase
              .from('products')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (productError) throw productError;

            // Update session state with new product data
            setSession(prevSession => {
              const updatedProducts = prevSession.products.map(product =>
                product.id === updatedProduct.id
                  ? {
                      ...product,
                      initial_stock: updatedProduct.initial_stock,
                      current_stock: updatedProduct.current_stock
                    }
                  : product
              );

              console.log('Updated products after real-time update:', updatedProducts);

              return {
                ...prevSession,
                products: updatedProducts
              };
            });
          } catch (error) {
            console.error('Error handling product update:', error);
          }
        }
      )
      .subscribe();

    // Subscribe to session updates
    const sessionChannel = supabase
      .channel('session_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${initialSession.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          console.log('Session update received:', payload);
          
          if (isUpdating) return;

          try {
            // Fetch the latest session data
            const { data: sessionData, error: sessionError } = await supabase
              .from('sessions')
              .select('*')
              .eq('id', initialSession.id)
              .single();

            if (sessionError) throw sessionError;

            setSession(sessionData);
          } catch (error) {
            console.error('Error handling session update:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [initialSession, isUpdating]);

  const handleUpdateStock = async (productId: number, newInitialStock: number) => {
    console.log('Updating stock in SessionDetails:', { productId, newInitialStock });
    
    try {
      setIsUpdating(true);

      // Update the product in the database
      const { data, error: updateError } = await supabase
        .from('products')
        .update({
          initial_stock: newInitialStock,
          current_stock: newInitialStock
        })
        .eq('id', productId)
        .select();

      if (updateError) throw updateError;

      if (data && data[0]) {
        // Update local state immediately
        setSession(prevSession => ({
          ...prevSession,
          products: prevSession.products.map(product => 
            product.id === productId 
              ? { 
                  ...product,
                  initial_stock: data[0].initial_stock,
                  current_stock: data[0].current_stock
                } 
              : product
          )
        }));
      }

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
    <div className="flex flex-col w-full gap-4 max-w-full overflow-hidden px-0 sm:px-4">
      {isMobile && onBack && (
        <Button
          variant="ghost"
          className="self-start -ml-2 text-muted-foreground"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Sessions
        </Button>
      )}
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-auto gap-2 sm:gap-16 bg-transparent p-2 sm:p-4">
          <TabsTrigger 
            value="inventory" 
            className="data-[state=active]:bg-primary/10 px-3 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap min-w-0 flex-shrink rounded-md hover:bg-muted/50"
          >
            Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-primary/10 px-3 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap min-w-0 flex-shrink rounded-md hover:bg-muted/50"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-primary/10 px-3 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap min-w-0 flex-shrink rounded-md hover:bg-muted/50"
          >
            History
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 w-full max-w-full overflow-hidden">
          <TabsContent value="inventory" className="m-0 w-full">
            <div className="overflow-x-auto px-2">
              <InventoryManagement 
                products={session.products} 
                onUpdateStock={handleUpdateStock}
              />
            </div>
          </TabsContent>
          <TabsContent value="overview" className="m-0">
            <SalesOverview session={session} />
          </TabsContent>
          <TabsContent value="history" className="m-0">
            <SalesHistory session={session} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}