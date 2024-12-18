import { useRef, useEffect, useState } from "react";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale, SessionProduct } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/lib/supabase";
import { useSessionRealtime } from "@/hooks/useSessionRealtime";

export const POSContent = () => {
  const { currentSession, setCurrentSession } = useSession();
  const { toast } = useToast();
  const cartRef = useRef<{ addProduct: (product: SessionProduct) => void }>(null);
  const [sessionProducts, setSessionProducts] = useState<SessionProduct[]>([]);

  // Use the real-time hook
  useSessionRealtime(currentSession, setCurrentSession, setSessionProducts);

  const handleProductSelect = (product: SessionProduct) => {
    if (cartRef.current) {
      cartRef.current.addProduct(product);
      toast({
        title: "Product added",
        description: `Added ${product.name} to cart`,
      });
    }
  };

  const handleSaleComplete = async (sale: Sale) => {
    if (!currentSession) return;

    try {
      console.log("Starting sale completion process...");
      
      // Get the current session data to ensure we have the latest sales
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', currentSession.id)
        .single();

      if (sessionError) {
        console.error('Error fetching current session:', sessionError);
        throw sessionError;
      }

      console.log("Current session data:", sessionData);

      // Prepare the updated sales array
      const currentSales = sessionData.sales || [];
      const updatedSales = [...currentSales, sale];

      console.log("Updating session with new sale:", sale);
      console.log("Total sales after update:", updatedSales.length);

      // Update the session with new sales data
      const { error: updateError } = await supabase
        .from('sessions')
        .update({ 
          sales: updatedSales 
        })
        .eq('id', currentSession.id);

      if (updateError) {
        console.error('Error updating session sales:', updateError);
        throw updateError;
      }

      // Update local session state with the complete session data
      setCurrentSession({
        ...sessionData,
        sales: updatedSales
      });

      console.log("Sale completed successfully. Updated session:", {
        ...sessionData,
        sales: updatedSales
      });

      toast({
        title: "Sale completed",
        description: `Total: RM${sale.total.toFixed(2)}`,
      });
    } catch (error) {
      console.error('Error completing sale:', error);
      toast({
        title: "Error",
        description: "Failed to complete sale. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Effect to load initial session inventory and sales data
  useEffect(() => {
    const loadSessionData = async () => {
      if (!currentSession?.id) return;

      try {
        // Fetch complete session data including sales
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', currentSession.id)
          .single();

        if (sessionError) {
          console.error('Error loading session data:', sessionError);
          throw sessionError;
        }

        // Fetch inventory data
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('session_inventory')
          .select('*')
          .eq('session_id', currentSession.id);

        if (inventoryError) {
          console.error('Error loading session inventory:', inventoryError);
          throw inventoryError;
        }

        // Update products with inventory data
        const updatedProducts = currentSession.products.map(product => {
          const inventory = inventoryData?.find(inv => inv.product_id === product.id);
          return {
            ...product,
            initial_stock: inventory?.initial_stock ?? 0,
            current_stock: inventory?.current_stock ?? 0
          };
        });

        setSessionProducts(updatedProducts);
        
        // Update current session with complete data
        setCurrentSession({
          ...sessionData,
          products: updatedProducts
        });

        console.log('Session data loaded:', sessionData);
        console.log('Updated products with inventory:', updatedProducts);
      } catch (error) {
        console.error('Error loading session data:', error);
        toast({
          title: "Error",
          description: "Failed to load session data",
          variant: "destructive",
        });
      }
    };

    loadSessionData();
  }, [currentSession?.id]);

  return (
    <>
      <SessionIndicator />
      <div className="min-h-[calc(100vh-65px)] bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full p-2 sm:p-4 lg:p-6">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-[1920px] mx-auto">
            <div className="order-1 lg:order-2 lg:col-span-1">
              <div className="lg:sticky lg:top-[80px]">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl backdrop-blur-lg bg-opacity-90 border border-gray-100">
                  <Cart ref={cartRef} onComplete={handleSaleComplete} />
                </div>
              </div>
            </div>

            <div className="order-2 lg:order-1 lg:col-span-2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-2 sm:p-4 lg:p-6 backdrop-blur-lg bg-opacity-90 border border-gray-100">
                {sessionProducts && sessionProducts.length > 0 ? (
                  <ProductGrid
                    products={sessionProducts}
                    onProductSelect={handleProductSelect}
                    variations={currentSession?.variations}
                  />
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-500">
                      No products available in this session.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};