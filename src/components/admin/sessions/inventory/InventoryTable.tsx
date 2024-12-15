import { SessionProduct } from "@/types/pos";
import { formatPrice } from "@/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InventoryTableProps {
  products: SessionProduct[];
  onUpdateStock: (productId: number, newInitialStock: number) => void;
}

export function InventoryTable({ products, onUpdateStock }: InventoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Initial Stock</TableHead>
          <TableHead>Current Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category || '-'}</TableCell>
            <TableCell>{formatPrice(Number(product.price))}</TableCell>
            <TableCell>
              <input
                type="number"
                min="0"
                value={product.initial_stock}
                onChange={(e) => onUpdateStock(product.id, parseInt(e.target.value))}
                className="w-20 p-1 border rounded"
              />
            </TableCell>
            <TableCell>{product.current_stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}