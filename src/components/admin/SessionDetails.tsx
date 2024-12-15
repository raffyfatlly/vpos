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
      <TabsList className="w-full bg-primary/5 mb-4">
        <TabsTrigger 
          value="inventory"
          className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Inventory Management
        </TabsTrigger>
        <TabsTrigger 
          value="sales"
          className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Sales Overview
        </TabsTrigger>
        <TabsTrigger 
          value="history"
          className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Sales History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inventory" className="mt-0">
        <InventoryManagement 
          session={session} 
          onUpdateStock={onUpdateStock}
        />
      </TabsContent>

      <TabsContent value="sales" className="mt-0">
        <SalesOverview session={session} />
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <SalesHistory session={session} />
      </TabsContent>
    </Tabs>
  );
}