import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SessionProduct } from "@/types/pos";

interface ProductGridProps {
  products: SessionProduct[];
  onProductSelect: (product: SessionProduct) => void;
}

export function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductSelect(product)}
            className="p-4 border rounded-lg hover:bg-accent transition-colors text-left space-y-2"
          >
            <div className="aspect-square bg-gray-100 rounded-md mb-2" />
            <h3 className="font-medium truncate">{product.name}</h3>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Stock: {product.currentStock}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}