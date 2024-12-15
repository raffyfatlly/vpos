import { useState, useEffect } from "react";
import { Session } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "./InventoryManagement";
import { SalesOverview } from "./SalesOverview";
import { SalesHistory } from "./SalesHistory";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newInitialStock: number) => void;
}

export function SessionDetails({ 
  session: initialSession, 
  onUpdateStock,
}: SessionDetailsProps) {
  const [session, setSession] = useState<Session>(initialSession);

  useEffect(() => {
    console.log('Session updated in SessionDetails:', initialSession);
    const hasProductChanges = JSON.stringify(initialSession.products) !== JSON.stringify(session.products);
    if (hasProductChanges) {
      setSession(initialSession);
    }
  }, [initialSession]);

  const handleUpdateStock = (productId: number, newInitialStock: number) => {
    console.log('Updating stock in SessionDetails:', { productId, newInitialStock });
    
    setSession(prevSession => {
      const updatedProducts = prevSession.products.map(product => {
        if (product.id === productId) {
          console.log('Updating product:', {
            before: product,
            after: { ...product, initial_stock: newInitialStock }
          });
          return {
            ...product,
            initial_stock: newInitialStock
          };
        }
        return product;
      });

      return {
        ...prevSession,
        products: updatedProducts
      };
    });

    onUpdateStock(productId, newInitialStock);
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