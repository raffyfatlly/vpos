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

              // Update both initial_stock and current_stock in our session state
              const updatedProducts = prevSession.products.map(existingProduct => 
                existingProduct.id === updatedProduct.id
                  ? {
                      ...existingProduct,
                      initial_stock: updatedProduct.initial_stock,
                      current_stock: updatedProduct.current_stock
                    }
                  : existingProduct
              );

              console.log('Updated products after real-time update:', updatedProducts);

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
        // Update local state immediately with the returned data
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