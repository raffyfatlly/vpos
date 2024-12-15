import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, X } from "lucide-react";
import { SessionProduct, ProductVariation } from "@/types/pos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CartItemProps {
  item: SessionProduct & { 
    quantity: number; 
    discount: number;
    selectedVariation?: ProductVariation;
  };
  onUpdateQuantity: (id: number, delta: number) => void;
  onApplyDiscount: (id: number, discount: number) => void;
  onSelectVariation: (id: number, variation: ProductVariation | undefined) => void;
}

export function CartItem({ 
  item, 
  onUpdateQuantity, 
  onApplyDiscount,
  onSelectVariation 
}: CartItemProps) {
  const itemPrice = item.selectedVariation?.price ?? item.price;
  const itemTotal = itemPrice * item.quantity;
  const finalPrice = itemTotal - item.discount;

  return (
    <tr>
      <td className="font-medium">
        <div className="space-y-1">
          <div>{item.name}</div>
          {item.variations && item.variations.length > 0 && (
            <Select
              value={item.selectedVariation?.id?.toString()}
              onValueChange={(value) => {
                const variation = item.variations?.find(
                  (v) => v.id.toString() === value
                );
                onSelectVariation(item.id, variation);
              }}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Select variation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Base (RM{item.price.toFixed(2)})</SelectItem>
                {item.variations.map((variation) => (
                  <SelectItem key={variation.id} value={variation.id.toString()}>
                    {variation.name} (RM{variation.price.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </td>
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