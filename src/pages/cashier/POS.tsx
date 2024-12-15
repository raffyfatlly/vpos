import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale, SessionProduct, Session, ProductVariation } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  if (!currentSession || !currentStaff) {
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

  // Add console.log to debug session products
  console.log("Current session products:", currentSession.products);

  return (
    <>
      <SessionIndicator />
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
              {currentSession.products && currentSession.products.length > 0 ? (
                <ProductGrid
                  products={currentSession.products}
                  onProductSelect={handleProductSelect}
                  variations={currentSession.variations}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No products available in this session.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2 sticky top-[65px] z-10">
            <div className="bg-white rounded-lg shadow-sm">
              <Cart ref={cartRef} onComplete={handleSaleComplete} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default POS;