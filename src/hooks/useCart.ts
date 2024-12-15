import { SessionProduct, PaymentMethod } from "@/types/pos";
import { useCartState } from "./cart/useCartState";
import { useCartOperations } from "./cart/useCartOperations";
import { useCartCalculations } from "./cart/useCartCalculations";
import { useCartCheckout } from "./cart/useCartCheckout";
import { SaleData } from "./cart/types";

export const useCart = (onComplete: (sale: SaleData) => void) => {
  const {
    items,
    setItems,
    paymentAmount,
    setPaymentAmount,
    selectedPayment,
    setSelectedPayment,
    globalDiscount,
    setGlobalDiscount,
    toast
  } = useCartState();

  const {
    addProduct,
    updateQuantity,
    applyDiscount,
    selectVariation,
    updateSessionProducts,
  } = useCartOperations(items, setItems, toast);

  const {
    getSubtotal,
    getTotal,
  } = useCartCalculations(items, globalDiscount);

  const { handleCheckout } = useCartCheckout(
    items,
    getSubtotal,
    getTotal,
    globalDiscount,
    selectedPayment,
    paymentAmount,
    setItems,
    setPaymentAmount,
    setGlobalDiscount,
    toast
  );

  return {
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
    updateSessionProducts,
    getSubtotal,
    getTotal,
    handleCheckout: () => handleCheckout(onComplete),
  };
};