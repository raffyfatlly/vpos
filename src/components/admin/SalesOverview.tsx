import { Session } from "@/types/pos";
import { Card, CardContent } from "@/components/ui/card";

interface SalesOverviewProps {
  session: Session;
}

export function SalesOverview({ session }: SalesOverviewProps) {
  const calculateTotalSales = () => {
    return session.sales?.reduce((total, sale) => total + sale.total, 0) || 0;
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <Card className="card-gradient w-full">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Sales</h3>
          <p className="text-2xl font-semibold">${calculateTotalSales().toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="card-gradient w-full">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Transactions</h3>
          <p className="text-2xl font-semibold">{session.sales?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}