import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionProduct, ProductVariation } from "@/types/pos";
import { X, Plus } from "lucide-react";

interface ProductFormProps {
  product?: SessionProduct;
  onSubmit: (productData: SessionProduct) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price ? product.price.toString() : "",
    category: product?.category || "",
    image: product?.image || "",
    variations: product?.variations || [] as ProductVariation[],
  });

  const handleAddVariation = () => {
    setFormData({
      ...formData,
      variations: [
        ...formData.variations,
        { id: Date.now(), name: "", price: 0 },
      ],
    });
  };

  const handleRemoveVariation = (index: number) => {
    setFormData({
      ...formData,
      variations: formData.variations.filter((_, i) => i !== index),
    });
  };

  const handleVariationChange = (
    index: number,
    field: keyof ProductVariation,
    value: string
  ) => {
    const updatedVariations = [...formData.variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: field === "price" ? Number(value) : value,
    };
    setFormData({ ...formData, variations: updatedVariations });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: product?.id || Date.now(),
      price: Number(formData.price),
      initialStock: product?.initialStock || 0,
      currentStock: product?.currentStock || 0,
      variations: formData.variations.map(v => ({
        ...v,
        price: Number(v.price)
      })),
      name: formData.name,
      category: formData.category,
      image: formData.image,
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
              Name
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
              Price
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariation}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variation
              </Button>
            </div>
            <div className="space-y-3">
              {formData.variations.map((variation, index) => (
                <div key={variation.id} className="flex gap-2 items-start">
                  <Input
                    placeholder="Name"
                    value={variation.name}
                    onChange={(e) =>
                      handleVariationChange(index, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={variation.price}
                    onChange={(e) =>
                      handleVariationChange(index, "price", e.target.value)
                    }
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVariation(index)}
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