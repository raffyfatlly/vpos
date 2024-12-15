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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {products.map((product) => (
          <Button
            key={product.id}
            onClick={() => onProductSelect(product)}
            variant="outline"
            className="h-auto p-2 sm:p-4 hover:bg-accent transition-colors text-left space-y-1 sm:space-y-2 flex flex-col items-start w-full"
          >
            <div className="aspect-square w-full bg-gray-100 rounded-md mb-1 sm:mb-2 overflow-hidden">
              <img 
                src={product.image || "/placeholder.svg"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium text-sm sm:text-base truncate w-full">{product.name}</h3>
            <div className="flex justify-between items-center w-full text-xs sm:text-sm">
              <p className="text-muted-foreground">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                Stock: {product.currentStock}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}