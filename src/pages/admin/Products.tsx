import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { SessionProduct } from "@/types/pos";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Products() {
  const [products, setProducts] = useState<SessionProduct[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SessionProduct | null>(null);
  const { toast } = useToast();

  // Fetch products from Supabase on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error fetching products",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (productData: SessionProduct) => {
    try {
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: productData.name,
            price: productData.price,
            category: productData.category,
            image: productData.image,
            variations: productData.variations
          })
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Product updated",
          description: `${productData.name} has been updated successfully.`
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([{
            name: productData.name,
            price: productData.price,
            category: productData.category,
            image: productData.image,
            variations: productData.variations
          }]);

        if (error) throw error;

        toast({
          title: "Product created",
          description: `${productData.name} has been added successfully.`
        });
      }

      // Refresh products list
      fetchProducts();
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error saving product",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (product: SessionProduct) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: `${product.name} has been deleted successfully.`
      });

      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error deleting product",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
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
              <p className="text-sm">Category: {product.category}</p>
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