import { SessionProduct } from "@/types/pos";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: SessionProduct;
  onEdit: (product: SessionProduct) => void;
  onDelete: (product: SessionProduct) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="aspect-square relative bg-accent rounded-md overflow-hidden">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-muted-foreground">RM {product.price.toFixed(2)}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm">Category: {product.category}</p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}