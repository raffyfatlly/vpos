import { Session, SessionProduct } from "@/types/pos";
import { SalesOverview } from "@/components/admin/SalesOverview";
import { InventoryTable } from "@/components/admin/sessions/inventory/InventoryTable";

interface SessionDetailsViewProps {
  session: Session;
  onUpdateStock: (sessionId: string, updatedProducts: SessionProduct[]) => void;
  onBack?: () => void;
  isMobile?: boolean;
}

export function SessionDetailsView({ 
  session, 
  onUpdateStock,
  onBack,
  isMobile 
}: SessionDetailsViewProps) {
  return (
    <div className="space-y-6">
      {isMobile && onBack && (
        <button
          onClick={onBack}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Sessions
        </button>
      )}
      <div className="text-sm text-muted-foreground mb-4">
        Session Date: {session.date}
      </div>
      <SalesOverview session={session} />
      <div className="rounded-lg border">
        <div className="p-4">
          <h3 className="text-lg font-medium">Session Inventory</h3>
          <InventoryTable 
            products={session.products}
            onInitialStockChange={(productId, newInitialStock) => {
              const updatedProducts = session.products.map(product =>
                product.id === productId
                  ? {
                      ...product,
                      initial_stock: newInitialStock,
                      current_stock: newInitialStock
                    }
                  : product
              );
              onUpdateStock(session.id, updatedProducts);
            }}
          />
        </div>
      </div>
    </div>
  );
}