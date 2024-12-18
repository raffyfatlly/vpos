import { useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/lib/supabase";
import { Session } from "@/types/pos";

export function SessionIndicator() {
  const { currentSession, setCurrentSession } = useSession();

  useEffect(() => {
    if (!currentSession) return;

    console.log("Setting up sales updates subscription in SessionIndicator");
    
    const channel = supabase
      .channel(`session_sales_${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${currentSession.id}`,
        },
        (payload: any) => {
          console.log("Received session update in SessionIndicator:", payload);
          
          if (payload.new && payload.new.sales) {
            const updatedSession: Session = {
              ...currentSession,
              sales: payload.new.sales
            };
            setCurrentSession(updatedSession);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up sales updates subscription in SessionIndicator");
      supabase.removeChannel(channel);
    };
  }, [currentSession?.id]);

  const totalSales = currentSession?.sales?.reduce((total, sale) => {
    // Ensure we're working with numbers
    const saleTotal = typeof sale.total === 'number' ? sale.total : Number(sale.total);
    return total + (isNaN(saleTotal) ? 0 : saleTotal);
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