import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Minus, X, DollarSign } from "lucide-react";
import { SessionProduct, PaymentMethod } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

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

export function Cart({ onComplete }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("bayarlah_qr");
  const { toast } = useToast();

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

  const getTax = () => getSubtotal() * 0.08; // 8% tax
  const getTotal = () => getSubtotal() + getTax();

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
      discount: items.reduce(
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
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discount || ""}
                    onChange={(e) =>
                      applyDiscount(item.id, parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                  />
                  %
                </TableCell>
                <TableCell>
                  ${((item.price * item.quantity * (100 - item.discount)) / 100).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, -item.quantity)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>${getTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedPayment === "bayarlah_qr" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setSelectedPayment("bayarlah_qr")}
          >
            Bayarlah QR
          </Button>
          <Button
            variant={selectedPayment === "cash" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setSelectedPayment("cash")}
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
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Complete Sale
        </Button>
      </div>
    </div>
  );
}