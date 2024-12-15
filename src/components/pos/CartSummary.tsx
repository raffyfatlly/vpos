import { PaymentMethod } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  globalDiscount: number;
  onGlobalDiscountChange: (discount: number) => void;
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
  total,
  selectedPayment,
  paymentAmount,
  onPaymentMethodChange,
  onPaymentAmountChange,
  onCheckout,
  hasItems,
}: CartSummaryProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2 text-sm border-t pt-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium">RM{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Discount:</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">RM</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={globalDiscount}
              onChange={(e) => onGlobalDiscountChange(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-20 h-8 text-right"
            />
          </div>
        </div>
        <div className="flex justify-between font-medium text-base pt-1 border-t">
          <span>Total:</span>
          <span className="text-primary">RM{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedPayment === "bayarlah_qr" ? "default" : "outline"}
          className="flex-1 h-9"
          onClick={() => onPaymentMethodChange("bayarlah_qr")}
        >
          Bayarlah QR
        </Button>
        <Button
          variant={selectedPayment === "cash" ? "default" : "outline"}
          className="flex-1 h-9"
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
        className="w-full h-11 text-base font-medium"
        onClick={onCheckout}
        disabled={!hasItems}
      >
        Complete Sale
      </Button>
    </div>
  );
}