import { useSession } from "@/contexts/SessionContext";

export function SessionIndicator() {
  const { currentSession } = useSession();

  const totalSales = currentSession?.sales?.reduce((total, sale) => {
    // Ensure we're working with numbers and handle potential undefined/null values
    const saleTotal = typeof sale.total === 'number' ? sale.total : Number(sale.total || 0);
    return total + saleTotal;
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