import { useSession } from "@/contexts/SessionContext";

export function SessionIndicator() {
  const { currentSession } = useSession();

  const totalSales = currentSession?.sales?.reduce((total, sale) => {
    // Get the total directly from the sale object
    return total + Number(sale.total);
  }, 0) || 0;

  if (!currentSession) return null;

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold">{currentSession.location}</h2>
            <p className="text-sm text-muted-foreground">{currentSession.date}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Sales</div>
            <div className="text-lg font-semibold text-primary">
              RM{totalSales.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}