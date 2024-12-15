import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useSessions } from "@/hooks/useSessions";
import { Session, SessionStaff } from "@/types/pos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function SessionSelector() {
  const { sessions, isLoading } = useSessions();
  const { setCurrentSession, setCurrentStaff } = useSession();
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  // Filter only active sessions
  const activeSessions = sessions.filter(
    (session) => session.status === "active"
  );

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
        const staffEntry: SessionStaff = {
          id: user.id,
          name: user.username,
          role: user.role,
        };
        
        const session: Session = {
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
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">No Active Sessions</CardTitle>
            <CardDescription className="text-lg">
              There are no active sessions available. Please contact an administrator to activate a session.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl border-gray-200">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Select a Session</CardTitle>
          <CardDescription className="text-lg">
            Choose an active session to begin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{session.location}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{session.date}</span>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSessionId && (
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
              onClick={() => handleSessionSelect(selectedSessionId)}
            >
              Start Session
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}