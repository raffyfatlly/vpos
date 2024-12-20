import { supabase } from "@/lib/supabase";
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

    // First update session_inventory
    for (const item of items) {
      const { error: inventoryError } = await supabase
        .from('session_inventory')
        .update({
          current_stock: item.current_stock - item.quantity
        })
        .eq('session_id', currentSession.id)
        .eq('product_id', item.id);

      if (inventoryError) {
        console.error('Error updating session inventory:', inventoryError);
        throw inventoryError;
      }
    }

    // Get updated inventory data
    const { data: updatedInventory, error: fetchError } = await supabase
      .from('session_inventory')
      .select('*')
      .eq('session_id', currentSession.id);

    if (fetchError) {
      console.error('Error fetching updated inventory:', fetchError);
      throw fetchError;
    }

    // Update session products with new stock levels
    const updatedProducts = currentSession.products.map(product => {
      const inventory = updatedInventory?.find(inv => inv.product_id === product.id);
      return {
        ...product,
        current_stock: inventory?.current_stock ?? product.current_stock
      };
    });

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