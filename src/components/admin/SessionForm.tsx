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
    if (session) {
      // Convert date from dd-mm-yyyy to yyyy-mm-dd for input field
      const [day, month, year] = (session.date || '').split('-');
      const formattedDate = day && month && year ? `${year}-${month}-${day}` : '';
      
      setFormData({
        location: session.location || "",
        date: formattedDate,
      });
    }
  }, [session]);

  const generateUniqueId = async () => {
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/[-:]/g, '')
      .replace(/[T.]/g, '')
      .slice(0, 17); // Include milliseconds for more uniqueness
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sessionId = `S${timestamp}-${random}`;

    // Check if this ID already exists
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', sessionId)
      .single();

    if (existingSession) {
      // If ID exists, try again with a new random component
      console.log('Session ID collision detected, generating new ID...');
      return generateUniqueId();
    }

    console.log('Generated unique session ID:', sessionId);
    return sessionId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert date from yyyy-mm-dd to dd-mm-yyyy for storage
      const [year, month, day] = formData.date.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      
      const sessionId = session?.id || await generateUniqueId();
      console.log('Using session ID:', sessionId);

      // First, fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;

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

      // Create the session data
      const sessionData = {
        id: sessionId,
        name: sessionId,
        date: formattedDate,
        location: formData.location,
        staff: session?.staff || [],
        products: sessionProducts,
        status: "active",
        sales: [],
        created_at: new Date().toISOString(),
      };

      console.log('Creating session with data:', sessionData);

      // Insert into sessions table
      const { error: sessionError } = await supabase
        .from('sessions')
        .insert([sessionData]);

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        throw sessionError;
      }

      // Create inventory entries for each product
      const inventoryData = sessionProducts.map(product => ({
        session_id: sessionId,
        product_id: product.id,
        initial_stock: 0,
        current_stock: 0,
      }));

      const { error: inventoryError } = await supabase
        .from('session_inventory')
        .insert(inventoryData);

      if (inventoryError) {
        console.error('Inventory creation error:', inventoryError);
        throw inventoryError;
      }

      onSubmit(sessionData);
      
      toast({
        title: "Session Created",
        description: `Created session ${sessionId} with ${sessionProducts.length} products`,
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