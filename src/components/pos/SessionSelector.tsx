import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useSessions } from "@/hooks/useSessions";
import { SessionStaff } from "@/types/pos";
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

export function SessionSelector() {
  const { sessions, isLoading } = useSessions();
  const { setCurrentSession, setCurrentStaff } = useSession();
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  const activeSessions = sessions.filter(session => session.status === "active");

  const handleSessionSelect = async (sessionId: string) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      if (sessionData && user) {
        // Double check that the session is still active
        if (sessionData.status !== "active") {
          toast({
            title: "Session unavailable",
            description: "This session is no longer active",
            variant: "destructive",
          });
          return;
        }

        const staffEntry: SessionStaff = {
          id: user.id,
          name: user.username,
          role: user.role,
        };
        
        const session = {
          ...sessionData,
          staff: sessionData.staff as SessionStaff[],
          products: productsData || [],
          sales: sessionData.sales || [],
          variations: sessionData.variations || [],
        };

        console.log("Selected session data:", session);
        console.log("Products loaded:", productsData);
        
        setSelectedSessionId(sessionId);
        setCurrentSession(session);
        setCurrentStaff(staffEntry);

        toast({
          title: "Session loaded",
          description: `Loaded ${productsData.length} products`,
        });
      }
    } catch (error: any) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load session data",
        variant: "destructive",
      });
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