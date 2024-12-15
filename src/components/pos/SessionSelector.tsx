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

export function SessionSelector() {
  const { sessions, isLoading } = useSessions();
  const { setCurrentSession, setCurrentStaff } = useSession();
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const { user } = useAuth();

  // Filter only active sessions
  const activeSessions = sessions.filter(
    (session) => session.status === "active"
  );

  const handleSessionSelect = async (sessionId: string) => {
    // Fetch the latest session data directly from Supabase
    const { data: sessionData, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching session:', error);
      return;
    }

    if (sessionData && user) {
      // Create a staff entry for the current user if they don't exist in the session
      const staffEntry: SessionStaff = {
        id: user.id,
        name: user.username,
        role: user.role,
      };
      
      // Convert the raw session data to the correct type
      const session: Session = {
        ...sessionData,
        staff: sessionData.staff as SessionStaff[],
        products: sessionData.products || [],
        sales: sessionData.sales || [],
        variations: sessionData.variations || [],
      };

      console.log("Selected session data:", session); // Debug log
      
      setSelectedSessionId(sessionId);
      setCurrentSession(session);
      setCurrentStaff(staffEntry);
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
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Active Sessions</CardTitle>
            <CardDescription>
              There are no active sessions available. Please contact an administrator to create a new session.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select a Session</CardTitle>
          <CardDescription>
            Choose an active session to begin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedSessionId}
            onValueChange={handleSessionSelect}
          >
            <SelectTrigger>
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
              className="w-full"
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