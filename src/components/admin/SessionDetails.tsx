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
    <Tabs defaultValue="inventory" className="w-full h-[calc(100vh-12rem)] flex flex-col">
      <TabsList className="w-full bg-primary/5 mb-4">
        <TabsTrigger 
          value="inventory"
          className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
        >
          Inventory Management
        </TabsTrigger>
        <TabsTrigger 
          value="sales"
          className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
        >
          Sales Overview
        </TabsTrigger>
        <TabsTrigger 
          value="history"
          className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
        >
          Sales History
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 min-h-0">
        <TabsContent value="inventory" className="h-full m-0 p-0">
          <InventoryManagement 
            session={session} 
            onUpdateStock={onUpdateStock}
          />
        </TabsContent>

        <TabsContent value="sales" className="h-full m-0 p-0">
          <SalesOverview session={session} />
        </TabsContent>

        <TabsContent value="history" className="h-full m-0 p-0">
          <SalesHistory session={session} />
        </TabsContent>
      </div>
    </Tabs>
  );
}