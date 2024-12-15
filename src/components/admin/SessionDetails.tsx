import { Session } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "./InventoryManagement";
import { SalesOverview } from "./SalesOverview";
import { SalesHistory } from "./SalesHistory";
import { useEffect, useState } from "react";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
}

export function SessionDetails({ 
  session: initialSession, 
  onUpdateStock,
}: SessionDetailsProps) {
  const [session, setSession] = useState<Session>({
    ...initialSession,
    sales: initialSession.sales || [] // Ensure sales is initialized as an array
  });

  // Reset session state when initialSession changes (different session selected)
  useEffect(() => {
    setSession({
      ...initialSession,
      sales: initialSession.sales || [] // Ensure sales is initialized as an array
    });
  }, [initialSession]);

  const handleUpdateStock = (productId: number, newStock: number) => {
    // Update local session state
    setSession(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === productId
          ? { ...product, current_stock: newStock }
          : product
      )
    }));
    
    // Call parent handler
    onUpdateStock(productId, newStock);
  };

  return (
    <Tabs defaultValue="inventory" className="w-full flex-1 flex flex-col">
      <TabsList className="w-full bg-background border-b">
        <TabsTrigger 
          value="inventory"
          className="px-8 py-3 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          Inventory
        </TabsTrigger>
        <TabsTrigger 
          value="sales"
          className="px-8 py-3 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          Sales Overview
        </TabsTrigger>
        <TabsTrigger 
          value="history"
          className="px-8 py-3 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          Sales History
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-hidden">
        <TabsContent value="inventory" className="h-full m-0 p-4">
          <InventoryManagement 
            session={session} 
            onUpdateStock={handleUpdateStock}
          />
        </TabsContent>

        <TabsContent value="sales" className="h-full m-0 p-4">
          <SalesOverview session={session} />
        </TabsContent>

        <TabsContent value="history" className="h-full m-0 p-4">
          <SalesHistory session={session} />
        </TabsContent>
      </div>
    </Tabs>
  );
}