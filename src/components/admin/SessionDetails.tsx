import { useState, useEffect } from "react";
import { Session } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "./InventoryManagement";
import { SalesOverview } from "./SalesOverview";
import { SalesHistory } from "./SalesHistory";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newInitialStock: number, newCurrentStock: number) => void;
}

export function SessionDetails({ 
  session: initialSession, 
  onUpdateStock,
}: SessionDetailsProps) {
  const [session, setSession] = useState<Session>({
    ...initialSession,
    sales: initialSession.sales || []
  });

  // Reset session state when initialSession changes (different session selected)
  useEffect(() => {
    setSession({
      ...initialSession,
      sales: initialSession.sales || []
    });
  }, [initialSession]);

  const handleUpdateStock = (productId: number, newInitialStock: number, newCurrentStock: number) => {
    const updatedProducts = session.products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          initial_stock: newInitialStock,
          current_stock: newCurrentStock
        };
      }
      return product;
    });

    setSession(prev => ({
      ...prev,
      products: updatedProducts
    }));

    onUpdateStock(productId, newInitialStock, newCurrentStock);
  };

  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="inventory" className="flex-1">Inventory</TabsTrigger>
        <TabsTrigger value="overview" className="flex-1">Sales Overview</TabsTrigger>
        <TabsTrigger value="history" className="flex-1">Sales History</TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        <InventoryManagement 
          products={session.products} 
          onUpdateStock={handleUpdateStock}
        />
      </TabsContent>
      <TabsContent value="overview">
        <SalesOverview session={session} />
      </TabsContent>
      <TabsContent value="history">
        <SalesHistory session={session} />
      </TabsContent>
    </Tabs>
  );
}