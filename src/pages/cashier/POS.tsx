import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale, SessionProduct, Session, ProductVariation } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { supabase } from "@/lib/supabase";

const POS = () => {
  const { user } = useAuth();
  const { currentSession, currentStaff, setCurrentSession } = useSession();
  const { toast } = useToast();
  const cartRef = useRef<{ addProduct: (product: SessionProduct) => void }>(null);

  // Effect to check session status
  useEffect(() => {
    if (currentSession) {
      const channel = supabase
        .channel('session_status')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'sessions',
            filter: `id=eq.${currentSession.id}`,
          },
          (payload) => {
            const updatedSession = payload.new as Session;
            if (updatedSession.status === 'completed') {
              toast({
                title: "Session completed",
                description: "This session has been marked as completed. Returning to session selection.",
              });
              setCurrentSession(null);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentSession, setCurrentSession, toast]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  // Always show session selector if no active session
  if (!currentSession || !currentStaff) {
    return <SessionSelector />;
  }

  // Only show POS interface if session is active
  if (currentSession.status !== "active") {
    setCurrentSession(null);
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
    // Fetch latest session data before updating
    const { data: latestSession, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', currentSession.id)
      .single();

    if (fetchError) {
      console.error('Error fetching latest session:', fetchError);
      toast({
        title: "Error",
        description: "Failed to complete sale. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Convert the raw data to Session type with proper type assertions
    const typedSession: Session = {
      ...latestSession,
      staff: latestSession.staff as Session['staff'],
      products: latestSession.products as SessionProduct[],
      sales: latestSession.sales as Sale[],
      variations: latestSession.variations as ProductVariation[] | undefined,
    };

    setCurrentSession(typedSession);

    toast({
      title: "Sale completed",
      description: `Total: RM${sale.total.toFixed(2)}`,
    });
  };

  return (
    <>
      <SessionIndicator />
      <div className="min-h-[calc(100vh-65px)] bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            <div className="order-2 lg:order-1 lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90 border border-gray-100">
                {currentSession.products && currentSession.products.length > 0 ? (
                  <ProductGrid
                    products={currentSession.products}
                    onProductSelect={handleProductSelect}
                    variations={currentSession.variations}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No products available in this session.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-1">
              <div className="sticky top-[80px]">
                <div className="bg-white rounded-2xl shadow-xl backdrop-blur-lg bg-opacity-90 border border-gray-100">
                  <Cart ref={cartRef} onComplete={handleSaleComplete} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default POS;