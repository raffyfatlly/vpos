import { useSession } from "@/contexts/SessionContext";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { Sale } from "@/types/pos";

const POS = () => {
  const { currentSession, currentStaff } = useSession();

  const handleSaleComplete = (saleData: Omit<Sale, "id" | "sessionId" | "staffId" | "timestamp">) => {
    // Here we would normally save the sale to the backend
    console.log("Sale completed:", {
      ...saleData,
      sessionId: currentSession?.id,
      staffId: currentStaff?.id,
      timestamp: new Date().toISOString(),
    });
  };

  if (!currentSession || !currentStaff) {
    return <SessionSelector />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      <div className="lg:col-span-2">
        <ProductGrid
          products={currentSession.products}
          onProductSelect={(product) => {
            // Handle product selection
            console.log("Selected product:", product);
          }}
        />
      </div>
      <div>
        <Cart onComplete={handleSaleComplete} />
      </div>
    </div>
  );
};

export default POS;
