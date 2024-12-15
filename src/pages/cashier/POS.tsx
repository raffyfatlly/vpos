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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-none">
        <SessionIndicator />
      </div>

      {/* Products Section */}
      <div className="flex-1 overflow-auto">
        <ProductGrid
          products={currentSession.products}
          onProductSelect={handleProductSelect}
        />
      </div>

      {/* Cart/Calculator Section */}
      <div className="flex-none mt-4">
        <Cart ref={cartRef} onComplete={handleSaleComplete} />
      </div>
    </div>
  );
};

export default POS;