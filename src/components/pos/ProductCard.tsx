import { SessionProduct } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: SessionProduct;
  onSelect: (product: SessionProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Button
      onClick={() => onSelect(product)}
      variant="outline"
      className={cn(
        "h-auto p-0 hover:bg-gray-50 transition-all duration-200 text-left",
        "flex flex-col items-start w-full overflow-hidden rounded-lg border border-gray-200",
        "hover:border-primary hover:shadow-md"
      )}
    >
      <div className="aspect-square w-full bg-gray-100 overflow-hidden">
        <img 
          src={product.image || "/placeholder.svg"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
      <div className="p-3 w-full space-y-1">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <div className="flex justify-between items-center w-full text-xs">
          <p className="font-semibold text-primary">
            RM{product.price.toFixed(2)}
          </p>
          <p className="text-muted-foreground">
            Stock: {product.currentStock}
          </p>
        </div>
      </div>
    </Button>
  );
}