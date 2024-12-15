import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session, SessionProduct } from "@/types/pos";
import { supabase } from "@/lib/supabase";

interface SessionFormProps {
  session?: Session;
  onSubmit: (sessionData: any) => void;
  onCancel: () => void;
}

export function SessionForm({ session, onSubmit, onCancel }: SessionFormProps) {
  const [formData, setFormData] = useState({
    location: session?.location || "",
    date: session?.date || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = session?.id || `SESSION-${Date.now()}`;
    
    // Fetch all products from the products table
    const { data: products } = await supabase
      .from('products')
      .select('*');

    // Reset stock values for new sessions
    const sessionProducts: SessionProduct[] = (products || []).map(product => ({
      ...product,
      initial_stock: 0,  // Reset initial stock to 0
      current_stock: 0,  // Reset current stock to 0
    }));

    onSubmit({
      ...formData,
      id: sessionId,
      name: sessionId,
      staff: session?.staff || [],
      products: session ? session.products : sessionProducts,
      status: session?.status || "active",
      sales: session?.sales || [],
    });
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