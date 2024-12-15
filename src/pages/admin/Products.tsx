import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const Products = () => {
  const [products] = useState([
    { id: 1, name: "Product 1", price: 9.99, stock: 50 },
    { id: 2, name: "Product 2", price: 19.99, stock: 30 },
  ]);

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
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="mt-2 space-y-1 text-gray-600">
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock} units</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;