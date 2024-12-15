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
        "h-auto p-0 transition-all duration-300 text-left group",
        "flex flex-col items-start w-full overflow-hidden rounded-xl",
        "border border-gray-200/80 hover:border-primary/30",
        "hover:shadow-lg hover:shadow-primary/5",
        "active:scale-[0.98] transform",
        product.current_stock <= 0 && "opacity-50"
      )}
      disabled={product.current_stock <= 0}
    >
      <div className="aspect-square w-full bg-gray-50 overflow-hidden relative group-hover:bg-gray-100/50">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <img 
            src="/placeholder.svg" 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-3 w-full space-y-1">
        <h3 className="font-medium text-sm sm:text-base truncate leading-tight">
          {product.name}
        </h3>
        <div className="flex justify-between items-center w-full">
          <p className="font-semibold text-primary text-base sm:text-lg">
            RM{product.price.toFixed(2)}
          </p>
          <div className="text-right">
            <p className={cn(
              "text-xs",
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