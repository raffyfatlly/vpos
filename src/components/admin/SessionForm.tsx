import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session, SessionProduct } from "@/types/pos";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';

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
    try {
      const timestamp = Date.now();
      const random = nanoid(6).toUpperCase();
      const sessionId = `S${timestamp}-${random}`;

      console.log('Checking session ID:', sessionId);
      
      // Check if this ID already exists
      const { data: existingSession, error: checkError } = await supabase
        .from('sessions')
        .select('id')
        .eq('id', sessionId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking session ID:', checkError);
        throw checkError;
      }

      if (existingSession) {
        console.log('Session ID collision detected, generating new ID...');
        // Recursive call with a small delay to avoid tight loops
        await new Promise(resolve => setTimeout(resolve, 100));
        return generateUniqueId();
      }

      console.log('Generated unique session ID:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error generating session ID:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert date from yyyy-mm-dd to dd-mm-yyyy for storage
      const [year, month, day] = formData.date.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      
      let sessionId;
      if (session?.id) {
        sessionId = session.id;
      } else {
        sessionId = await generateUniqueId();
        // Double-check one more time before proceeding
        const { data: finalCheck } = await supabase
          .from('sessions')
          .select('id')
          .eq('id', sessionId)
          .maybeSingle();
          
        if (finalCheck) {
          throw new Error('Session ID collision detected during final check');
        }
      }
      
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