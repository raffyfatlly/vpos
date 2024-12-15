import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session, SessionProduct } from "@/types/pos";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SessionFormProps {
  session?: Session;
  onSubmit: (sessionData: any) => void;
  onCancel: () => void;
}

export function SessionForm({ session, onSubmit, onCancel }: SessionFormProps) {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      location: session?.location || "",
      date: session?.date || "",
    });
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const sessionId = session?.id || `S${timestamp}-${Math.floor(Math.random() * 1000)}`;
    
    try {
      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;

      console.log('Fetched products for session:', products);

      // Initialize session products with zero stock
      const sessionProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        variations: product.variations || [],
        session_id: sessionId,
        initial_stock: 0,
        current_stock: 0,
      }));

      const sessionData = {
        ...formData,
        id: sessionId,
        name: sessionId,
        staff: session?.staff || [],
        products: sessionProducts,
        status: session?.status || "active",
        sales: [], 
        created_at: new Date().toISOString(),
      };

      // Create session inventory records
      const inventoryData = sessionProducts.map(product => ({
        session_id: sessionId,
        product_id: product.id,
        initial_stock: 0,
        current_stock: 0,
      }));

      const { error: inventoryError } = await supabase
        .from('session_inventory')
        .insert(inventoryData);

      if (inventoryError) throw inventoryError;

      console.log('Creating session with data:', sessionData);

      onSubmit(sessionData);
      
      toast({
        title: "Session Created",
        description: `Created with ${sessionProducts.length} products`,
      });
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {session ? "Edit Session" : "Create Session"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {session ? "Update Session" : "Create Session"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}