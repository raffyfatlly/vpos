import { useSession } from "@/contexts/SessionContext";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Sale } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

const POS = () => {
  const { currentSession, currentStaff } = useSession();
  const { toast } = useToast();

  const handleSaleComplete = (saleData: Omit<Sale, "id" | "sessionId" | "staffId" | "timestamp">) => {
    console.log("Sale completed:", {
      ...saleData,
      sessionId: currentSession?.id,
      staffId: currentStaff?.id,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Sale completed successfully",
      description: `Total amount: $${saleData.total.toFixed(2)}`,
    });
  };

  if (!currentSession || !currentStaff) {
    return <SessionSelector />;
  }

  return (
    <div className="space-y-6">
      <SessionIndicator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-2">
          <ProductGrid
            products={currentSession.products}
            onProductSelect={(product) => {
              console.log("Selected product:", product);
            }}
          />
        </div>
        <div>
          <Cart onComplete={handleSaleComplete} />
        </div>
      </div>
    </div>
  );
};

export default POS;