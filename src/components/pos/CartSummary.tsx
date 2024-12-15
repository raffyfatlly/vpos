import { PaymentMethod } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  globalDiscount: number;
  onGlobalDiscountChange: (discount: number) => void;
  discountAmount: number;
  total: number;
  selectedPayment: PaymentMethod;
  paymentAmount: string;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentAmountChange: (amount: string) => void;
  onCheckout: () => void;
  hasItems: boolean;
}

export function CartSummary({
  subtotal,
  globalDiscount,
  onGlobalDiscountChange,
  discountAmount,
  total,
  selectedPayment,
  paymentAmount,
  onPaymentMethodChange,
  onPaymentAmountChange,
  onCheckout,
  hasItems,
}: CartSummaryProps) {
  return (
    <div className="border-t pt-4 space-y-3">
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discount:</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              value={globalDiscount}
              onChange={(e) => onGlobalDiscountChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-20 h-8 text-right"
            />
            <span>% (${discountAmount.toFixed(2)})</span>
          </div>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedPayment === "bayarlah_qr" ? "default" : "outline"}
          className="flex-1"
          onClick={() => onPaymentMethodChange("bayarlah_qr")}
        >
          Bayarlah QR
        </Button>
        <Button
          variant={selectedPayment === "cash" ? "default" : "outline"}
          className="flex-1"
          onClick={() => onPaymentMethodChange("cash")}
        >
          Cash
        </Button>
      </div>

      {selectedPayment === "cash" && (
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="number"
            placeholder="Payment amount"
            value={paymentAmount}
            onChange={(e) => onPaymentAmountChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <Button
        className="w-full"
        onClick={onCheckout}
        disabled={!hasItems}
      >
        Complete Sale
      </Button>
    </div>
  );
}