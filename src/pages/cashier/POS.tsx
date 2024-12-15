import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale, SessionProduct } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { supabase } from "@/lib/supabase";

const POS = () => {
  const { user } = useAuth();
  const { currentSession, currentStaff, setCurrentSession, clearSession } = useSession();
  const { toast } = useToast();
  const cartRef = useRef<{ addProduct: (product: SessionProduct) => void }>(null);

  // Effect to clear session on component mount
  useEffect(() => {
    clearSession();
  }, []);

  // Effect to check session status and listen for product updates
  useEffect(() => {
    if (currentSession) {
      console.log('Subscribing to session updates for session:', currentSession.id);
      
      // Listen for session-specific updates
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
            console.log('Session update received:', payload);
            
            if (payload.new) {
              const updatedSession = payload.new;
              console.log('Updated session data:', updatedSession);

              if (updatedSession.status === 'completed') {
                toast({
                  title: "Session completed",
                  description: "This session has been marked as completed. Returning to session selection.",
                });
                clearSession();
              } else {
                // Update session with new data, including product stock changes
                setCurrentSession(updatedSession);
                
                // Show toast for stock updates
                toast({
                  title: "Stock updated",
                  description: "Product stock has been updated in this session",
                });
              }
            }
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        console.log('Cleaning up session subscription');
        supabase.removeChannel(channel);
      };
    }
  }, [currentSession?.id]); // Only re-subscribe when session ID changes

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

  const handleProductSelect = (product: SessionProduct) => {
    if (cartRef.current) {
      cartRef.current.addProduct(product);
      toast({
        title: "Product added",
        description: `Added ${product.name} to cart`,
      });
    }
  };

  const handleSaleComplete = async (sale: {
    products: {
      productId: number;
      quantity: number;
      price: number;
      discount: number;
      variationId?: number;
    }[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: "cash" | "bayarlah_qr";
  }) => {
    toast({
      title: "Sale completed",
      description: `Total: RM${sale.total.toFixed(2)}`,
    });
  };

  return (
    <>
      <SessionIndicator />
      <div className="min-h-[calc(100vh-65px)] bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full p-2 sm:p-4 lg:p-6">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-[1920px] mx-auto">
            {/* Cart Section - Shown first on mobile */}
            <div className="order-1 lg:order-2 lg:col-span-1">
              <div className="lg:sticky lg:top-[80px]">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl backdrop-blur-lg bg-opacity-90 border border-gray-100">
                  <Cart ref={cartRef} onComplete={handleSaleComplete} />
                </div>
              </div>
            </div>

            {/* Products Grid Section */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-2 sm:p-4 lg:p-6 backdrop-blur-lg bg-opacity-90 border border-gray-100">
                {currentSession.products && currentSession.products.length > 0 ? (
                  <ProductGrid
                    products={currentSession.products}
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

export default POS;