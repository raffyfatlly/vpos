import { useState, forwardRef, useImperativeHandle } from "react";
import { useToast } from "@/hooks/use-toast";
import { SessionProduct, PaymentMethod } from "@/types/pos";
import { CartSummary } from "./CartSummary";
import { CartItemList } from "./CartItemList";

interface CartItem extends SessionProduct {
  quantity: number;
  discount: number;
}

interface CartProps {
  onComplete: (sale: {
    products: { productId: number; quantity: number; price: number; discount: number }[];
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
          const existingItem = current.find((item) => item.id === product.id);
          if (existingItem) {
            return current.map((item) =>
              item.id === product.id
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

    const applyDiscount = (id: number, discountPercent: number) => {
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, discount: Math.min(100, Math.max(0, discountPercent)) }
            : item
        )
      );
    };

    const getSubtotal = () => {
      return items.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        const discountAmount = (itemTotal * item.discount) / 100;
        return sum + (itemTotal - discountAmount);
      }, 0);
    };

    const getGlobalDiscountAmount = () => {
      const subtotal = getSubtotal();
      return (subtotal * globalDiscount) / 100;
    };

    const getTotal = () => {
      const subtotal = getSubtotal();
      const discountAmount = getGlobalDiscountAmount();
      return subtotal - discountAmount;
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
          price: item.price,
          discount: item.discount,
        })),
        subtotal: getSubtotal(),
        discount: getGlobalDiscountAmount() + items.reduce(
          (sum, item) =>
            sum + (item.price * item.quantity * item.discount) / 100,
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
          description: `Change due: $${change.toFixed(2)}`,
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
        />
        <CartSummary
          subtotal={getSubtotal()}
          globalDiscount={globalDiscount}
          onGlobalDiscountChange={setGlobalDiscount}
          discountAmount={getGlobalDiscountAmount()}
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