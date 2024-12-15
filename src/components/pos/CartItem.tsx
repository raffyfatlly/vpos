import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, X } from "lucide-react";
import { SessionProduct } from "@/types/pos";

interface CartItemProps {
  item: SessionProduct & { quantity: number; discount: number };
  onUpdateQuantity: (id: number, delta: number) => void;
  onApplyDiscount: (id: number, discount: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onApplyDiscount }: CartItemProps) {
  const itemTotal = item.price * item.quantity;
  const finalPrice = itemTotal - item.discount;

  return (
    <tr>
      <td className="font-medium">{item.name}</td>
      <td>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, -1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-1">
          <span>RM</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={item.discount || ""}
            onChange={(e) => onApplyDiscount(item.id, parseFloat(e.target.value) || 0)}
            className="w-20"
          />
        </div>
      </td>
      <td>
        RM{finalPrice.toFixed(2)}
      </td>
      <td>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(item.id, -item.quantity)}
        >
          <X className="h-3 w-3" />
        </Button>
      </td>
    </tr>
  );
}