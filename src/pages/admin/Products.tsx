import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { SessionProduct } from "@/types/pos";
import { useToast } from "@/components/ui/use-toast";

const Products = () => {
  const [products, setProducts] = useState<SessionProduct[]>(MOCK_PRODUCTS);
  const { toast } = useToast();

  const handleUpdateStock = (productId: number, newStock: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, currentStock: newStock }
          : product
      )
    );
    
    toast({
      title: "Stock Updated",
      description: "Product stock has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="mt-2 space-y-1 text-gray-600">
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Initial Stock: {product.initialStock}</p>
              <p>Current Stock: {product.currentStock}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newStock = product.currentStock + 1;
                  handleUpdateStock(product.id, newStock);
                }}
              >
                + Stock
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newStock = Math.max(0, product.currentStock - 1);
                  handleUpdateStock(product.id, newStock);
                }}
              >
                - Stock
              </Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;