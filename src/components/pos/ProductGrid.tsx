import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SessionProduct, ProductVariation } from "@/types/pos";
import { ProductCard } from "./ProductCard";
import { useState } from "react";

interface ProductGridProps {
  products: SessionProduct[];
  onProductSelect?: (product: SessionProduct) => void;
  variations?: ProductVariation[];
}

export function ProductGrid({ products, onProductSelect, variations }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 w-full">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg py-2 border-b">
        <div className="flex gap-2 items-center max-w-md mx-auto px-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-8 h-10 bg-gray-50/50 border-gray-200 rounded-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}