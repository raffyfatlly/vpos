import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useSessions } from "@/hooks/useSessions";
import { SessionStaff, SessionProduct } from "@/types/pos";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { SessionCard } from "./session-selector/SessionCard";
import { SessionOption } from "./session-selector/SessionOption";
import { NoActiveSessions } from "./session-selector/NoActiveSessions";

type SessionProductData = {
  id: number;
  initial_stock?: number;
  current_stock?: number;
  [key: string]: any;
};

export function SessionSelector() {
  const { sessions, isLoading } = useSessions();
  const { setCurrentSession, setCurrentStaff } = useSession();
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  // Only show active sessions
  const activeSessions = sessions.filter(session => session.status === "active");

  const handleSessionSelect = async (sessionId: string) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('status', 'active') // Only allow active sessions
        .single();

      if (sessionError) throw sessionError;

      // If no active session found
      if (!sessionData) {
        toast({
          title: "Session unavailable",
          description: "This session is no longer active",
          variant: "destructive",
        });
        setSelectedSessionId("");
        return;
      }

      // Fetch all current products with their latest stock values
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;

      if (sessionData && user) {
        const staffEntry: SessionStaff = {
          id: user.id,
          name: user.username,
          role: user.role,
        };

        // Create a map of existing session products for quick lookup
        const sessionProductsMap = new Map(
          (sessionData.products as SessionProductData[]).map((p) => [p.id, p])
        );

        // Initialize all products with latest stock values from the products table
        const mergedProducts = (productsData as SessionProductData[]).map(product => {
          const sessionProduct = sessionProductsMap.get(product.id);
          return {
            ...product,
            initial_stock: product.initial_stock ?? 0,  // Use the current initial_stock
            current_stock: product.current_stock ?? 0,  // Use the current current_stock
          };
        });

        // Update the session's products in the database with latest stock values
        const { error: updateError } = await supabase
          .from('sessions')
          .update({
            products: mergedProducts
          })
          .eq('id', sessionId);

        if (updateError) throw updateError;
        
        const session = {
          ...sessionData,
          staff: sessionData.staff as SessionStaff[],
          products: mergedProducts as SessionProduct[],
          sales: sessionData.sales || [],
          variations: sessionData.variations || [],
        };

        console.log("Selected session data:", session);
        console.log("Products loaded:", mergedProducts);
        
        setSelectedSessionId(sessionId);
        setCurrentSession(session);
        setCurrentStaff(staffEntry);

        toast({
          title: "Session loaded",
          description: `Loaded ${mergedProducts.length} products`,
        });
      }
    } catch (error: any) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load session data",
        variant: "destructive",
      });
      setSelectedSessionId("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }

  if (activeSessions.length === 0) {
    return <NoActiveSessions />;
  }

  return (
    <SessionCard
      title="Select an Active Session"
      description="Choose an active session to begin"
    >
      <Select
        value={selectedSessionId}
        onValueChange={handleSessionSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a session" />
        </SelectTrigger>
        <SelectContent>
          {activeSessions.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              <SessionOption session={session} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSessionId && (
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
          onClick={() => handleSessionSelect(selectedSessionId)}
        >
          Load Session
        </Button>
      )}
    </SessionCard>
  );
}