import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { SessionProduct } from "@/types/pos";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const [products, setProducts] = useState<SessionProduct[]>(MOCK_PRODUCTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SessionProduct | null>(null);
  const { toast } = useToast();

  const handleSubmit = (productData: SessionProduct) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
      toast({
        title: "Product updated",
        description: `${productData.name} has been updated successfully.`
      });
    } else {
      setProducts([...products, { ...productData, id: products.length + 1 }]);
      toast({
        title: "Product created",
        description: `${productData.name} has been added successfully.`
      });
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (product: SessionProduct) => {
    setProducts(products.filter(p => p.id !== product.id));
    toast({
      title: "Product deleted",
      description: `${product.name} has been deleted successfully.`
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 space-y-2">
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
              <p className="text-sm">Stock: {product.currentStock}</p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingProduct(product);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}