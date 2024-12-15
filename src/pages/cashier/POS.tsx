import { useSession } from "@/contexts/SessionContext";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale, SessionProduct } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

const POS = () => {
  const { currentSession, currentStaff } = useSession();
  const { toast } = useToast();
  const cartRef = useRef<{ addProduct: (product: SessionProduct) => void }>(null);

  const handleProductSelect = (product: SessionProduct) => {
    if (cartRef.current) {
      cartRef.current.addProduct(product);
      toast({
        title: "Product added",
        description: `Added ${product.name} to cart`,
      });
    }
  };

  if (!currentSession || !currentStaff) {
    return <SessionSelector />;
  }

  return (
    <div className="space-y-6">
      <SessionIndicator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-2 overflow-auto">
          <ProductGrid
            products={currentSession.products}
            onProductSelect={handleProductSelect}
          />
        </div>
        <div className="overflow-auto">
          <Cart ref={cartRef} onComplete={handleSaleComplete} />
        </div>
      </div>
    </div>
  );
};

const handleSaleComplete = (saleData: Omit<Sale, "id" | "sessionId" | "staffId" | "timestamp">) => {
  console.log("Sale completed:", saleData);
};

export default POS;