import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale, SessionProduct } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { supabase } from "@/lib/supabase";

// Separate component for the main POS content to reduce file size
const POSContent = () => {
  const { currentSession, setCurrentSession } = useSession();
  const { toast } = useToast();
  const cartRef = useRef<{ addProduct: (product: SessionProduct) => void }>(null);
  const [sessionProducts, setSessionProducts] = useState<SessionProduct[]>([]);

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
    toast({
      title: "Sale completed",
      description: `Total: RM${sale.total.toFixed(2)}`,
    });
  };

  // Effect to load initial session inventory
  useEffect(() => {
    const loadSessionInventory = async () => {
      if (!currentSession?.id) return;

      try {
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('session_inventory')
          .select('*')
          .eq('session_id', currentSession.id);

        if (inventoryError) throw inventoryError;

        const updatedProducts = currentSession.products.map(product => {
          const inventory = inventoryData?.find(inv => inv.product_id === product.id);
          return {
            ...product,
            initial_stock: inventory?.initial_stock ?? 0,
            current_stock: inventory?.current_stock ?? 0
          };
        });

        setSessionProducts(updatedProducts);
        console.log('Updated products with inventory:', updatedProducts);
      } catch (error) {
        console.error('Error loading session inventory:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        });
      }
    };

    loadSessionInventory();
  }, [currentSession?.id]);

  // Effect to handle real-time updates
  useEffect(() => {
    if (!currentSession) return;

    console.log('Setting up real-time subscriptions for session:', currentSession.id);
    
    // Listen for session updates including sales
    const channel = supabase
      .channel(`session_${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${currentSession.id}`,
        },
        async (payload: any) => {
          console.log('Received session update:', payload);
          
          if (payload.new) {
            const updatedSession = payload.new;
            
            // Check if status changed to completed
            if (updatedSession.status === 'completed') {
              toast({
                title: "Session completed",
                description: "This session has been marked as completed. Returning to session selection.",
              });
              setCurrentSession(null);
              return;
            }

            // Update session with new data, preserving the sales array
            setCurrentSession(prev => ({
              ...prev!,
              ...updatedSession,
              // Ensure sales array is preserved and updated
              sales: updatedSession.sales || prev?.sales || []
            }));

            // If products were updated, update the local products state
            if (updatedSession.products) {
              setSessionProducts(updatedSession.products);
              toast({
                title: "Stock updated",
                description: "Product stock has been updated",
              });
            }
          }
        }
      )
      .subscribe();

    // Listen for inventory updates
    const inventoryChannel = supabase
      .channel(`inventory_${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_inventory',
          filter: `session_id=eq.${currentSession.id}`,
        },
        async () => {
          const { data: inventoryData, error: inventoryError } = await supabase
            .from('session_inventory')
            .select('*')
            .eq('session_id', currentSession.id);

          if (inventoryError) {
            console.error('Error fetching updated inventory:', inventoryError);
            return;
          }

          const updatedProducts = currentSession.products.map(product => {
            const inventory = inventoryData?.find(inv => inv.product_id === product.id);
            return {
              ...product,
              initial_stock: inventory?.initial_stock ?? 0,
              current_stock: inventory?.current_stock ?? 0
            };
          });

          setSessionProducts(updatedProducts);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(inventoryChannel);
    };
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
                    variations={currentSession.variations}
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

// Main POS component
const POS = () => {
  const { user } = useAuth();
  const { currentSession, currentStaff, clearSession } = useSession();

  // Effect to clear session on component mount
  useEffect(() => {
    clearSession();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  if (!currentSession || !currentStaff) {
    return <SessionSelector />;
  }

  if (currentSession.status !== "active") {
    clearSession();
    return <SessionSelector />;
  }

  return <POSContent />;
};

export default POS;