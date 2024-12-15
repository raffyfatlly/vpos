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
        "hover:border-primary hover:shadow-md active:scale-95",
        product.current_stock <= 0 && "opacity-50"
      )}
      disabled={product.current_stock <= 0}
    >
      <div className="aspect-square w-full bg-gray-100 overflow-hidden">
        <img 
          src={product.image || "/placeholder.svg"} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2 w-full space-y-0.5">
        <h3 className="font-medium text-xs sm:text-sm truncate">{product.name}</h3>
        <div className="flex justify-between items-center w-full text-xs">
          <p className="font-semibold text-primary">
            RM{product.price.toFixed(2)}
          </p>
          <div className="text-right">
            <p className={cn(
              "text-[10px] sm:text-xs",
              product.current_stock <= 5 ? "text-red-500" : "text-muted-foreground"
            )}>
              Stock: {product.current_stock}
            </p>
          </div>
        </div>
      </div>
    </Button>
  );
}