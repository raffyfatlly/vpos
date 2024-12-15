import { SessionProduct } from "@/types/pos";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: SessionProduct;
  onSelect: (product: SessionProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Button
      onClick={() => onSelect(product)}
      variant="outline"
      className="h-auto p-2 hover:bg-accent transition-colors text-left space-y-1 flex flex-col items-start w-full"
    >
      <div className="aspect-square w-full bg-gray-100 rounded-md mb-1 overflow-hidden">
        <img 
          src={product.image || "/placeholder.svg"} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-medium text-sm truncate w-full">{product.name}</h3>
      <div className="flex justify-between items-center w-full text-xs">
        <p className="text-muted-foreground">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-muted-foreground">
          Stock: {product.currentStock}
        </p>
      </div>
    </Button>
  );
}