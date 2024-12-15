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
  const [session, setSession] = useState<Session>(initialSession);

  // Only update session state when initialSession changes completely
  useEffect(() => {
    console.log('Session updated in SessionDetails:', initialSession);
    // Deep compare products to prevent unnecessary updates
    const hasProductChanges = JSON.stringify(initialSession.products) !== JSON.stringify(session.products);
    if (hasProductChanges) {
      setSession(initialSession);
    }
  }, [initialSession]);

  const handleUpdateStock = (productId: number, newInitialStock: number, newCurrentStock: number) => {
    console.log('Updating stock in SessionDetails:', { productId, newInitialStock, newCurrentStock });
    
    // Update local session state first
    setSession(prevSession => {
      const updatedProducts = prevSession.products.map(product => {
        if (product.id === productId) {
          console.log('Updating product:', {
            before: product,
            after: { ...product, initial_stock: newInitialStock, current_stock: newCurrentStock }
          });
          return {
            ...product,
            initial_stock: newInitialStock,
            current_stock: newCurrentStock
          };
        }
        return product;
      });

      return {
        ...prevSession,
        products: updatedProducts
      };
    });

    // Call the parent's onUpdateStock callback
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