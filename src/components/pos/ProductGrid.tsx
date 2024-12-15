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
    <div className="space-y-8">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg py-4 border-b">
        <div className="flex gap-4 items-center max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 h-12 bg-gray-50/50 border-gray-200 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}