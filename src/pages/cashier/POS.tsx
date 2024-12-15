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

  // If no session is selected, show session selector
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
    // Add the sale to the session
    console.log("Sale completed:", {
      ...saleData,
      sessionId: currentSession.id,
      staffId: currentStaff.id,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Sale completed",
      description: `Total: RM${saleData.total.toFixed(2)}`,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header with session info */}
      <div className="flex-none">
        <SessionIndicator />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Products grid - takes 2/3 of the space */}
        <div className="flex-1 overflow-auto rounded-lg border bg-background">
          <ProductGrid
            products={currentSession.products}
            onProductSelect={handleProductSelect}
          />
        </div>

        {/* Cart section - takes 1/3 of the space */}
        <div className="w-1/3 overflow-auto">
          <Cart ref={cartRef} onComplete={handleSaleComplete} />
        </div>
      </div>
    </div>
  );
};

export default POS;