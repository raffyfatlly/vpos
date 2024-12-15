import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { SessionProduct } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/admin/products/ProductCard";

export default function Products() {
  const [products, setProducts] = useState<SessionProduct[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SessionProduct | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      const transformedProducts: SessionProduct[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        category: product.category || '',
        image: product.image || '',
        variations: product.variations || [],
        initial_stock: product.initial_stock || 0,
        current_stock: product.current_stock || 0,
        session_id: product.session_id || ''
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error fetching products",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (productData: SessionProduct) => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: productData.name,
            price: productData.price,
            category: productData.category,
            image: productData.image,
            variations: productData.variations,
          })
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Product updated",
          description: `${productData.name} has been updated successfully.`
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            name: productData.name,
            price: productData.price,
            category: productData.category,
            image: productData.image,
            variations: productData.variations,
          }]);

        if (error) throw error;

        toast({
          title: "Product created",
          description: `${productData.name} has been added successfully.`
        });
      }

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
          <ProductCard
            key={product.id}
            product={product}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
          />
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