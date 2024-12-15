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
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">
              Low Stock
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 w-full space-y-2">
        <h3 className="font-medium text-base truncate leading-tight text-gray-900">
          {product.name}
        </h3>
        <div className="flex justify-between items-center w-full">
          <p className="font-semibold text-primary text-lg tracking-tight">
            RM{product.price.toFixed(2)}
          </p>
          <div className="text-right">
            <p className={cn(
              "text-sm font-medium",
              isLowStock ? "text-red-600" : "text-gray-500"
            )}>
              Stock: {product.current_stock}
            </p>
          </div>
        </div>
      </div>
    </Button>
  );
}