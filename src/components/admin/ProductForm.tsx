import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionProduct, ProductVariation } from "@/types/pos";
import { Plus, X } from "lucide-react";

interface ProductFormProps {
  product?: SessionProduct | null;
  onSubmit: (productData: SessionProduct) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    initialStock: product?.initialStock || 0,
    currentStock: product?.currentStock || 0,
    category: product?.category || "",
    image: product?.image || "/placeholder.svg",
    variations: product?.variations || [],
  });

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [
        ...formData.variations,
        { id: Date.now(), name: "", price: 0 },
      ],
    });
  };

  const removeVariation = (id: number) => {
    setFormData({
      ...formData,
      variations: formData.variations.filter((v) => v.id !== id),
    });
  };

  const updateVariation = (id: number, field: keyof ProductVariation, value: string | number) => {
    setFormData({
      ...formData,
      variations: formData.variations.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: product?.id || 0,
      price: Number(formData.price),
      initialStock: Number(formData.initialStock),
      currentStock: Number(formData.currentStock),
      variations: formData.variations.map(v => ({
        ...v,
        price: Number(v.price)
      })),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          {product ? "Edit Product" : "Create Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Product Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Base Price (RM)
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="initialStock" className="text-sm font-medium">
              Initial Stock
            </label>
            <Input
              id="initialStock"
              type="number"
              value={formData.initialStock}
              onChange={(e) =>
                setFormData({ ...formData, initialStock: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="currentStock" className="text-sm font-medium">
              Current Stock
            </label>
            <Input
              id="currentStock"
              type="number"
              value={formData.currentStock}
              onChange={(e) =>
                setFormData({ ...formData, currentStock: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Variations</label>
              <Button type="button" variant="outline" size="sm" onClick={addVariation}>
                <Plus className="h-4 w-4 mr-1" />
                Add Variation
              </Button>
            </div>
            <div className="space-y-3">
              {formData.variations.map((variation) => (
                <div key={variation.id} className="flex gap-2 items-start">
                  <Input
                    placeholder="Name"
                    value={variation.name}
                    onChange={(e) =>
                      updateVariation(variation.id, "name", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={variation.price}
                    onChange={(e) =>
                      updateVariation(variation.id, "price", parseFloat(e.target.value))
                    }
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariation(variation.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
