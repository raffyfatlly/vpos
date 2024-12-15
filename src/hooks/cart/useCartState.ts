import { useState } from "react";
import { CartItem } from "./types";
import { SessionProduct, PaymentMethod } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

export const useCartState = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("bayarlah_qr");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const { toast } = useToast();

  return {
    items,
    setItems,
    paymentAmount,
    setPaymentAmount,
    selectedPayment,
    setSelectedPayment,
    globalDiscount,
    setGlobalDiscount,
    toast
  };
};