import { SessionProduct } from "@/types/pos";
import { Input } from "@/components/ui/input";

interface InventoryTableProps {
  products: SessionProduct[];
  onInitialStockChange: (productId: number, newInitialStock: number) => void;
}

export function InventoryTable({ products, onInitialStockChange }: InventoryTableProps) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-500 mb-2">
        <div>Product</div>
        <div className="text-left">Initial Stock</div>
        <div>Current Stock</div>
      </div>
      {products.map((product: SessionProduct) => (
        <div key={product.id} className="grid grid-cols-3 gap-4 py-2 border-t items-center">
          <div>{product.name}</div>
          <div className="text-left">
            <Input
              type="number"
              min="0"
              value={product.initial_stock || 0}
              onChange={(e) => {
                const newValue = parseInt(e.target.value) || 0;
                onInitialStockChange(product.id, newValue);
              }}
              className="w-24"
            />
          </div>
          <div>{product.current_stock || 0}</div>
        </div>
      ))}
    </div>
  );
}