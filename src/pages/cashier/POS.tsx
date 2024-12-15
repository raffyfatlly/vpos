import { useSession } from "@/contexts/SessionContext";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale, SessionProduct } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const POS = () => {
  const { currentSession, currentStaff } = useSession();
  const { toast } = useToast();
  const { user } = useAuth();
  const cartRef = useRef<{ addProduct: (product: SessionProduct) => void }>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  // If no session is selected, show the session selector
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

  const handleSaleComplete = (saleData: Omit<Sale, "id" | "sessionId" | "staffId" | "timestamp">) => {
    const completeSale = {
      ...saleData,
      id: `SALE-${Date.now()}`,
      sessionId: currentSession.id,
      staffId: currentStaff.id,
      timestamp: new Date().toISOString(),
    };

    console.log("Sale completed:", completeSale);

    toast({
      title: "Sale completed",
      description: `Total: RM${saleData.total.toFixed(2)}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionIndicator />
      
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
              {currentSession.products && currentSession.products.length > 0 ? (
                <ProductGrid
                  products={currentSession.products}
                  onProductSelect={handleProductSelect}
                />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900">No Products Available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no products available in this session.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section - Sticky on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2 sticky top-[65px] z-10">
            <div className="bg-white rounded-lg shadow-sm">
              <Cart ref={cartRef} onComplete={handleSaleComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;