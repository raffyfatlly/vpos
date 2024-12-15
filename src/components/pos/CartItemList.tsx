import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionProduct } from "@/types/pos";
import { CartItem } from "./CartItem";

interface CartItemListProps {
  items: (SessionProduct & { quantity: number; discount: number })[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onApplyDiscount: (id: number, discount: number) => void;
}

export function CartItemList({
  items,
  onUpdateQuantity,
  onApplyDiscount,
}: CartItemListProps) {
  return (
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
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onApplyDiscount={onApplyDiscount}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}