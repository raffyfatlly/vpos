import { SessionProduct } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: SessionProduct;
  onSelect: (product: SessionProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const isLowStock = product.current_stock <= 5;
  const isOutOfStock = product.current_stock <= 0;

  return (
    <Button
      onClick={() => onSelect(product)}
      variant="outline"
      className={cn(
        "h-auto p-0 transition-all duration-300 text-left group",
        "flex flex-col items-start w-full overflow-hidden rounded-xl",
        "border border-gray-100 hover:border-primary/20",
        "bg-white shadow-sm hover:shadow-md",
        "active:scale-[0.98] transform",
        isOutOfStock && "opacity-50 cursor-not-allowed"
      )}
      disabled={isOutOfStock}
    >
      <div className="aspect-square w-full bg-gray-50/50 overflow-hidden relative">
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
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full",
            isOutOfStock && "bg-gray-100 text-gray-600",
            isLowStock && !isOutOfStock && "bg-red-50 text-red-600",
            !isLowStock && !isOutOfStock && "bg-green-50 text-green-600"
          )}>
            Stock: {product.current_stock}
          </span>
        </div>
      </div>
      <div className="p-4 w-full space-y-3">
        <h3 className="font-medium text-lg truncate leading-tight text-gray-900">
          {product.name}
        </h3>
        <p className="font-semibold text-primary text-xl tracking-tight">
          RM{product.price.toFixed(2)}
        </p>
      </div>
    </Button>
  );
}