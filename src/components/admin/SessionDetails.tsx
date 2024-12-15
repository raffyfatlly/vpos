import { useState, useEffect } from "react";
import { Session } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesOverview } from "./SalesOverview";
import { SalesHistory } from "./SalesHistory";
import { supabase } from "@/lib/supabase";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { InventoryTable } from "./sessions/inventory/InventoryTable";
import { useInventoryUpdates } from "./sessions/inventory/useInventoryUpdates";
import { useToast } from "@/hooks/use-toast";

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
  const { isUpdating, setIsUpdating } = useInventoryUpdates(initialSession, setSession);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Update local session when initial session changes
  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  // Subscribe to real-time product updates
  useEffect(() => {
    const channel = supabase
      .channel('session_product_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        async (payload) => {
          console.log('Product update received in SessionDetails:', payload);
          
          if (payload.new && 'id' in payload.new) {
            const updatedProduct = payload.new;
            
            setSession(prevSession => ({
              ...prevSession,
              products: prevSession.products.map(product =>
                product.id === updatedProduct.id
                  ? {
                      ...product,
                      initial_stock: updatedProduct.initial_stock,
                      current_stock: updatedProduct.current_stock
                    }
                  : product
              )
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStock = async (productId: number, newInitialStock: number) => {
    console.log('Updating stock in SessionDetails:', { productId, newInitialStock });
    
    try {
      setIsUpdating(true);

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
        // Update local session state immediately
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

        toast({
          title: "Stock Updated",
          description: "Stock has been updated successfully.",
        });
      }

      onUpdateStock(productId, newInitialStock);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update stock.",
        variant: "destructive",
      });
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
              <InventoryTable 
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