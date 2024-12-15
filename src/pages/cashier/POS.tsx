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

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has cashier access
  if (user.role !== "cashier" && user.role !== "both") {
    return <Navigate to="/" replace />;
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
    console.log("Sale completed:", saleData);
  };

  if (!currentSession || !currentStaff) {
    return <SessionSelector />;
  }

  return (
    <div className="space-y-4">
      <SessionIndicator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
        <div className="lg:col-span-2 overflow-auto order-2 lg:order-1">
          <ProductGrid
            products={currentSession.products}
            onProductSelect={handleProductSelect}
          />
        </div>
        <div className="overflow-auto order-1 lg:order-2">
          <Cart ref={cartRef} onComplete={handleSaleComplete} />
        </div>
      </div>
    </div>
  );
};

export default POS;