import { Session, SessionProduct } from "@/types/pos";
import { SalesOverview } from "@/components/admin/SalesOverview";
import { InventoryTable } from "@/components/admin/sessions/inventory/InventoryTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SessionDetailsViewProps {
  session: Session;
  onBack?: () => void;
  isMobile?: boolean;
}

export function SessionDetailsView({ 
  session, 
  onBack,
  isMobile 
}: SessionDetailsViewProps) {
  const { toast } = useToast();

  const handleUpdateStock = async (sessionId: string, updatedProducts: SessionProduct[]) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({
          products: updatedProducts
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      toast({
        title: "Stock Updated",
        description: "Product stock has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              handleUpdateStock(session.id, updatedProducts);
            }}
          />
        </div>
      </div>
    </div>
  );
}