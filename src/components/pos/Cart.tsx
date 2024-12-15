import { forwardRef, useImperativeHandle, useEffect } from "react";
import { SessionProduct } from "@/types/pos";
import { CartSummary } from "./CartSummary";
import { CartItemList } from "./CartItemList";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/contexts/SessionContext";

interface CartProps {
  onComplete: Parameters<typeof useCart>[0];
}

export const Cart = forwardRef<{ addProduct: (product: SessionProduct) => void }, CartProps>(
  ({ onComplete }, ref) => {
    const { currentSession } = useSession();
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
    } = useCart(onComplete);

    useImperativeHandle(ref, () => ({
      addProduct,
    }));

    // Listen for session-specific product updates
    useEffect(() => {
      if (!currentSession) return;

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
            if (payload.new && payload.new.products) {
              updateSessionProducts(payload.new.products);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [currentSession]);

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