import { Session } from "@/types/pos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InventoryManagementProps {
  session: Session;
  onUpdateStock: (productId: number, newStock: number) => void;
}

export function InventoryManagement({ session, onUpdateStock }: InventoryManagementProps) {
  const handleStockChange = (productId: number, value: string) => {
    const newStock = parseInt(value) || 0;
    onUpdateStock(productId, newStock);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Initial Stock</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Update Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {session.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.initialStock}</TableCell>
              <TableCell>{product.currentStock}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="New stock count"
                  className="w-24"
                  onChange={(e) => handleStockChange(product.id, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStock(product.id, product.currentStock)}
                >
                  Update Stock
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}