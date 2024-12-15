import { Session } from "@/types/pos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "./InventoryManagement";
import { SalesOverview } from "./SalesOverview";
import { SalesHistory } from "./SalesHistory";

interface SessionDetailsProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
}

export function SessionDetails({ 
  session, 
  onUpdateStock,
}: SessionDetailsProps) {
  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList>
        <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
        <TabsTrigger value="sales">Sales Overview</TabsTrigger>
        <TabsTrigger value="history">Sales History</TabsTrigger>
      </TabsList>

      <TabsContent value="inventory" className="space-y-4">
        <InventoryManagement 
          session={session} 
          onUpdateStock={onUpdateStock}
        />
      </TabsContent>

      <TabsContent value="sales" className="space-y-4">
        <SalesOverview session={session} />
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <SalesHistory session={session} />
      </TabsContent>
    </Tabs>
  );
}