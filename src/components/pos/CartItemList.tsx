import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionProduct, ProductVariation } from "@/types/pos";
import { CartItem } from "./CartItem";

interface CartItemListProps {
  items: (SessionProduct & { 
    quantity: number; 
    discount: number;
    selectedVariation?: ProductVariation;
  })[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onApplyDiscount: (id: number, discount: number) => void;
  onSelectVariation: (id: number, variation: ProductVariation | undefined) => void;
}

export function CartItemList({
  items,
  onUpdateQuantity,
  onApplyDiscount,
  onSelectVariation,
}: CartItemListProps) {
  return (
    <div className="flex-1 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Item</TableHead>
            <TableHead className="w-[20%]">Qty</TableHead>
            <TableHead className="w-[20%]">Disc</TableHead>
            <TableHead className="w-[15%]">Price</TableHead>
            <TableHead className="w-[5%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <CartItem
              key={`${item.id}-${item.selectedVariation?.id || ''}`}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onApplyDiscount={onApplyDiscount}
              onSelectVariation={onSelectVariation}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}