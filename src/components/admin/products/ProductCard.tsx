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
    <div className="border rounded-lg p-4 h-full flex flex-col">
      <div className="aspect-square relative bg-accent rounded-md overflow-hidden mb-3">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground">RM {product.price.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground line-clamp-1">Category: {product.category}</p>
          <div className="flex gap-2 shrink-0">
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
    </div>
  );
}