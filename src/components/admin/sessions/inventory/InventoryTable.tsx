import { SessionProduct } from "@/types/pos";
import { Input } from "@/components/ui/input";

interface InventoryTableProps {
  products?: SessionProduct[];
  onInitialStockChange: (productId: number, newInitialStock: number) => void;
}

export function InventoryTable({ products = [], onInitialStockChange }: InventoryTableProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No products available
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Headers - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 font-medium text-sm text-gray-500 mb-2">
        <div>Product</div>
        <div className="text-center">Initial Stock</div>
        <div className="text-center">Current Stock</div>
      </div>
      
      {/* Product rows */}
      {products.map((product: SessionProduct) => (
        <div key={product.id} className="flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-4 py-4 border-t">
          <div className="font-medium md:font-normal">{product.name}</div>
          
          <div className="flex items-center justify-between md:justify-center gap-4 mt-2 md:mt-0">
            <div className="flex items-center gap-2 md:w-full md:justify-center">
              <span className="text-sm text-gray-500 md:hidden">Initial:</span>
              <Input
                type="number"
                min="0"
                value={product.initial_stock || 0}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0;
                  onInitialStockChange(product.id, newValue);
                }}
                className="w-24 text-center"
              />
            </div>
            
            <div className="flex items-center gap-2 md:hidden">
              <span className="text-sm text-gray-500">Current:</span>
              <div className="min-w-[40px] text-center">{product.current_stock || 0}</div>
            </div>
          </div>

          <div className="hidden md:flex md:justify-center">
            {product.current_stock || 0}
          </div>
        </div>
      ))}
    </div>
  );
}