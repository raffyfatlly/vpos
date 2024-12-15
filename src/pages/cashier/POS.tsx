import { useEffect, useRef, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { Cart } from "@/components/pos/Cart";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { SessionSelector } from "@/components/pos/SessionSelector";
import { SessionIndicator } from "@/components/pos/SessionIndicator";
import { Card } from "@/components/ui/card";
import { Sale } from "@/types/pos";

export default function POS() {
  const { currentSession } = useSession();
  const cartRef = useRef<{ addProduct: Function }>(null);
  const [salesSummary, setSalesSummary] = useState({
    cash: 0,
    bayarlah_qr: 0,
    total: 0
  });

  useEffect(() => {
    if (currentSession?.sales) {
      const summary = currentSession.sales.reduce((acc, sale: Sale) => {
        acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
        acc.total += sale.total;
        return acc;
      }, { cash: 0, bayarlah_qr: 0, total: 0 });
      setSalesSummary(summary);
    }
  }, [currentSession?.sales]);

  if (!currentSession) {
    return <SessionSelector />;
  }

  return (
    <div className="h-full flex flex-col">
      <SessionIndicator />
      
      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background">
          <h3 className="text-sm font-medium text-muted-foreground">Cash Sales</h3>
          <p className="text-2xl font-semibold">RM {salesSummary.cash.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background">
          <h3 className="text-sm font-medium text-muted-foreground">Bayarlah QR Sales</h3>
          <p className="text-2xl font-semibold">RM {salesSummary.bayarlah_qr.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background">
          <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
          <p className="text-2xl font-semibold">RM {salesSummary.total.toFixed(2)}</p>
        </Card>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4">
        <ProductGrid onProductClick={(product) => cartRef.current?.addProduct(product)} />
        <Cart ref={cartRef} onComplete={() => {}} />
      </div>
    </div>
  );
}