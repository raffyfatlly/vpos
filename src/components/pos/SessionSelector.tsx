import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useSessions } from "@/hooks/useSessions";
import { SessionStaff } from "@/types/pos";
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
      // First, fetch the session data
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Then, fetch the inventory data for this session
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('session_inventory')
        .select(`
          *,
          products (*)
        `)
        .eq('session_id', sessionId);

      if (inventoryError) throw inventoryError;

      // Transform inventory data into products array
      const products = inventoryData.map(inv => ({
        ...inv.products,
        initial_stock: inv.initial_stock,
        current_stock: inv.current_stock,
        session_id: sessionId
      }));

      // Fetch sales data
      const { data: salesData, error: salesError } = await supabase
        .from('session_sales')
        .select('*')
        .eq('session_id', sessionId);

      if (salesError) throw salesError;

      if (sessionData && user) {
        const staffEntry: SessionStaff = {
          id: user.id,
          name: user.username,
          role: user.role,
        };

        const session = {
          ...sessionData,
          products: products,
          sales: salesData || [],
          staff: [staffEntry]
        };

        console.log("Selected session data:", session);
        
        setSelectedSessionId(sessionId);
        setCurrentSession(session);
        setCurrentStaff(staffEntry);

        toast({
          title: "Session loaded",
          description: `Loaded ${products.length} products`,
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
    </SessionCard>
  );
}