import { CartItem } from "./types";
import { SessionProduct } from "@/types/pos";

export const useCartOperations = (
  items: CartItem[],
  setItems: (items: CartItem[]) => void,
  toast: any
) => {
  const addProduct = (product: SessionProduct) => {
    if (product.currentStock <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    setItems((current) => {
      const existingItem = current.find((item) => 
        item.id === product.id && 
        !item.selectedVariation
      );

      if (existingItem && existingItem.quantity + 1 > product.currentStock) {
        toast({
          title: "Insufficient stock",
          description: "Cannot add more of this item due to stock limitations.",
          variant: "destructive",
        });
        return current;
      }

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id && !item.selectedVariation
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((current) => {
      const updatedItems = current.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          if (delta > 0 && newQuantity > item.currentStock) {
            toast({
              title: "Insufficient stock",
              description: "Cannot add more of this item due to stock limitations.",
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  const applyDiscount = (id: number, discountAmount: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, discount: Math.max(0, discountAmount) }
          : item
      )
    );
  };

  const selectVariation = (id: number, variation: ProductVariation | undefined) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, selectedVariation: variation }
          : item
      )
    );
  };

  return {
    addProduct,
    updateQuantity,
    applyDiscount,
    selectVariation,
  };
};