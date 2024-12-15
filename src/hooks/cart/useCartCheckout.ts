import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { CartItem, SaleData } from "./types";
import { v4 as uuidv4 } from "uuid";
import { PaymentMethod } from "@/types/pos";

export const useCartCheckout = (
  items: CartItem[],
  getSubtotal: () => number,
  getTotal: () => number,
  globalDiscount: number,
  selectedPayment: PaymentMethod,
  paymentAmount: string,
  setItems: (items: CartItem[]) => void,
  setPaymentAmount: (amount: string) => void,
  setGlobalDiscount: (amount: number) => void,
  toast: any
) => {
  const { currentSession, setCurrentSession } = useSession();

  const updateProductStocks = async () => {
    if (!currentSession) return;

    // Update products in the database
    for (const item of items) {
      const newStock = item.current_stock - item.quantity;
      
      const { error } = await supabase
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating stock:', error);
        throw error;
      }
    }

    // Create sale data
    const saleData: SaleData = {
      id: uuidv4(),
      products: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.selectedVariation?.price ?? item.price,
        discount: item.discount,
        variationId: item.selectedVariation?.id,
      })),
      subtotal: getSubtotal(),
      discount: globalDiscount,
      total: getTotal(),
      paymentMethod: selectedPayment,
      timestamp: new Date().toISOString()
    };

    // Update session products with new stock levels
    const updatedProducts = currentSession.products.map(product => {
      const soldItem = items.find(item => item.id === product.id);
      if (soldItem) {
        return {
          ...product,
          current_stock: product.current_stock - soldItem.quantity
        };
      }
      return product;
    });

    // Update session in database with new products and sale
    const { error: sessionError } = await supabase
      .from('sessions')
      .update({
        products: updatedProducts,
        sales: [...(currentSession.sales || []), saleData]
      })
      .eq('id', currentSession.id);

    if (sessionError) {
      console.error('Error updating session:', sessionError);
      throw sessionError;
    }

    // Update local session state
    setCurrentSession({
      ...currentSession,
      products: updatedProducts,
      sales: [...(currentSession.sales || []), saleData]
    });

    return saleData;
  };

  const handleCheckout = async (onComplete: (sale: SaleData) => void) => {
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

    try {
      const saleData = await updateProductStocks();
      if (saleData) {
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
      }
    } catch (error) {
      console.error('Error completing sale:', error);
      toast({
        title: "Error",
        description: "Failed to complete sale. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleCheckout
  };
};