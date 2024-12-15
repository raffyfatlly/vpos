import { useState, forwardRef, useImperativeHandle } from "react";
import { useToast } from "@/hooks/use-toast";
import { SessionProduct, PaymentMethod, ProductVariation } from "@/types/pos";
import { CartSummary } from "./CartSummary";
import { CartItemList } from "./CartItemList";

interface CartItem extends SessionProduct {
  quantity: number;
  discount: number;
  selectedVariation?: ProductVariation;
}

interface CartProps {
  onComplete: (sale: {
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
  }) => void;
}

export const Cart = forwardRef<{ addProduct: (product: SessionProduct) => void }, CartProps>(
  ({ onComplete }, ref) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("bayarlah_qr");
    const [globalDiscount, setGlobalDiscount] = useState(0);
    const { toast } = useToast();

    useImperativeHandle(ref, () => ({
      addProduct: (product: SessionProduct) => {
        setItems((current) => {
          const existingItem = current.find((item) => 
            item.id === product.id && 
            !item.selectedVariation
          );
          if (existingItem) {
            return current.map((item) =>
              item.id === product.id && !item.selectedVariation
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...current, { ...product, quantity: 1, discount: 0 }];
        });
      },
    }));

    const updateQuantity = (id: number, delta: number) => {
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        ).filter((item) => item.quantity > 0)
      );
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

    const handleCheckout = () => {
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

    return (
      <div className="border rounded-lg p-4 space-y-4">
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