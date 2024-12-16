import { forwardRef, useImperativeHandle, useEffect } from "react";
import { SessionProduct } from "@/types/pos";
import { CartSummary } from "./CartSummary";
import { CartItemList } from "./CartItemList";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/contexts/SessionContext";
import { useToast } from "@/hooks/use-toast";

interface CartProps {
  onComplete: Parameters<typeof useCart>[0];
}

export const Cart = forwardRef<{ addProduct: (product: SessionProduct) => void }, CartProps>(
  ({ onComplete }, ref) => {
    const { currentSession, setCurrentSession } = useSession();
    const { toast } = useToast();
    const {
      items,
      paymentAmount,
      selectedPayment,
      globalDiscount,
      setPaymentAmount,
      setSelectedPayment,
      setGlobalDiscount,
      addProduct,
      updateQuantity,
      applyDiscount,
      selectVariation,
      getSubtotal,
      getTotal,
      handleCheckout,
      updateSessionProducts,
    } = useCart((sale) => {
      if (!currentSession) return;

      // Ensure we're working with numeric totals
      const saleWithNumericTotal = {
        ...sale,
        total: Number(sale.total)
      };

      // Calculate the new total sales
      const existingSales = currentSession.sales || [];
      const updatedSales = [...existingSales, saleWithNumericTotal];
      
      const updatedSession = {
        ...currentSession,
        sales: updatedSales
      };

      // Update local state first
      setCurrentSession(updatedSession);

      // Then update Supabase
      supabase
        .from('sessions')
        .update({ 
          sales: updatedSales 
        })
        .eq('id', currentSession.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating session sales:', error);
            toast({
              title: "Error",
              description: "Failed to update session sales",
              variant: "destructive",
            });
          }
        });

      // Call the original onComplete handler
      onComplete(saleWithNumericTotal);
    });

    useImperativeHandle(ref, () => ({
      addProduct,
    }));

    // Listen for session-specific product updates only
    useEffect(() => {
      if (!currentSession) return;

      console.log("Setting up product updates subscription in Cart for session:", currentSession.id);
      
      const channel = supabase
        .channel(`session_products_${currentSession.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'sessions',
            filter: `id=eq.${currentSession.id}`,
          },
          (payload: any) => {
            console.log("Received session update in Cart:", payload);
            
            if (payload.new && payload.new.products) {
              console.log("Updating session products in Cart:", payload.new.products);
              updateSessionProducts(payload.new.products);
              
              // Only update products, preserve sales
              setCurrentSession({
                ...currentSession,
                products: payload.new.products
              });
              
              toast({
                title: "Stock Updated",
                description: "Product stock has been updated",
              });
            }
          }
        )
        .subscribe();

      return () => {
        console.log("Cleaning up product updates subscription in Cart");
        supabase.removeChannel(channel);
      };
    }, [currentSession?.id]);

    return (
      <div className="p-4 sm:p-6 space-y-6">
        <CartItemList
          items={items}
          onUpdateQuantity={updateQuantity}
          onApplyDiscount={applyDiscount}
          onSelectVariation={selectVariation}
        />
        <CartSummary
          subtotal={getSubtotal()}
          globalDiscount={globalDiscount}
          onGlobalDiscountChange={setGlobalDiscount}
          total={getTotal()}
          selectedPayment={selectedPayment}
          paymentAmount={paymentAmount}
          onPaymentMethodChange={setSelectedPayment}
          onPaymentAmountChange={setPaymentAmount}
          onCheckout={handleCheckout}
          hasItems={items.length > 0}
        />
      </div>
    );
  }
);

Cart.displayName = "Cart";