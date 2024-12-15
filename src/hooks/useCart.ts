import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SessionProduct, PaymentMethod, ProductVariation } from "@/types/pos";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";

interface CartItem extends SessionProduct {
  quantity: number;
  discount: number;
  selectedVariation?: ProductVariation;
}

export const useCart = (onComplete: (sale: {
  products: { 
    productId: number; 
    quantity: number; 
    price: number; 
    discount: number;
    variationId?: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
}) => void) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("bayarlah_qr");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const { toast } = useToast();
  const { currentSession, currentStaff } = useSession();

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

  const handleCheckout = async () => {
    const total = getTotal();
    const payment = parseFloat(paymentAmount);
    
    if (selectedPayment === "cash" && (!payment || payment < total)) {
      toast({
        title: "Invalid payment amount",
        description: "Please enter a valid payment amount that covers the total.",
        variant: "destructive",
      });
      return;
    }

    if (!currentSession) {
      toast({
        title: "No session selected",
        description: "Please select a session before completing the sale.",
        variant: "destructive",
      });
      return;
    }

    const saleData = {
      products: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.selectedVariation?.price ?? item.price,
        discount: item.discount,
        variationId: item.selectedVariation?.id,
      })),
      subtotal: getSubtotal(),
      discount: globalDiscount + items.reduce(
        (sum, item) => sum + item.discount,
        0
      ),
      total: getTotal(),
      paymentMethod: selectedPayment,
    };

    const updatedProducts = currentSession.products.map(product => {
      const soldItem = items.find(item => item.id === product.id);
      if (soldItem) {
        return {
          ...product,
          currentStock: product.currentStock - soldItem.quantity
        };
      }
      return product;
    });

    const { error } = await supabase
      .from('sessions')
      .update({
        products: updatedProducts,
        sales: [...(currentSession.sales || []), saleData]
      })
      .eq('id', currentSession.id);

    if (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Error",
        description: "Failed to complete sale. Please try again.",
        variant: "destructive",
      });
      return;
    }

    onComplete(saleData);
    
    if (selectedPayment === "cash") {
      const change = payment - total;
      toast({
        title: "Sale completed",
        description: `Change due: RM${change.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Sale completed",
        description: "Payment received via Bayarlah QR",
      });
    }
    
    setItems([]);
    setPaymentAmount("");
    setGlobalDiscount(0);
  };

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
    getSubtotal,
    getTotal,
    handleCheckout,
  };
};