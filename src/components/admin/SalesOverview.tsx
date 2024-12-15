import { Session } from "@/types/pos";

interface SalesOverviewProps {
  session: Session;
}

export function SalesOverview({ session }: SalesOverviewProps) {
  const calculateTotalSales = () => {
    return session.sales?.reduce((total, sale) => total + sale.total, 0) || 0;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold">Total Sales</h3>
        <p className="text-2xl">${calculateTotalSales().toFixed(2)}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold">Total Transactions</h3>
        <p className="text-2xl">{session.sales?.length || 0}</p>
      </div>
    </div>
  );
}