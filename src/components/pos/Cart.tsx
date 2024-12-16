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
      // Update the session with the new sale
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          sales: [...(currentSession.sales || []), sale]
        };
        setCurrentSession(updatedSession);
      }
      // Call the original onComplete handler
      onComplete(sale);
    });

    useImperativeHandle(ref, () => ({
      addProduct,
    }));

    // Listen for session-specific product updates
    useEffect(() => {
      if (!currentSession) return;

      console.log("Setting up session subscription in Cart for session:", currentSession.id);
      
      const channel = supabase
        .channel(`session_${currentSession.id}`)
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
        console.log("Cleaning up session subscription in Cart");
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