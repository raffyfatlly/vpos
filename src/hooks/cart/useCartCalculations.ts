import { CartItem } from "./types";

export const useCartCalculations = (items: CartItem[], globalDiscount: number) => {
  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemPrice = item.selectedVariation?.price ?? item.price;
      const itemTotal = itemPrice * item.quantity;
      return sum + (itemTotal - item.discount);
    }, 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    return subtotal - globalDiscount;
  };

  return {
    getSubtotal,
    getTotal,
  };
};