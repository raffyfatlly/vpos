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
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="lg:grid lg:grid-cols-3 gap-4 sm:gap-6 flex flex-col">
          {/* Products Section - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
              <ProductGrid
                products={currentSession.products}
                onProductSelect={handleProductSelect}
              />
            </div>
          </div>

          {/* Cart Section - Full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1 order-1 lg:order-2 mb-4 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm sticky top-[72px] lg:top-20">
              <Cart ref={cartRef} onComplete={handleSaleComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
