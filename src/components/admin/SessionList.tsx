import { useState } from "react";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Toggle } from "@/components/ui/toggle";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function SessionList({ 
  sessions, 
  onSessionUpdate,
  onSelect,
  selectedSession,
  onDelete 
}: { 
  sessions: Session[]; 
  onSessionUpdate: (updatedSession: Session) => void;
  onSelect: (session: Session) => void;
  selectedSession: Session | null;
  onDelete: (sessionId: string) => void;
}) {
  const { toast } = useToast();
  const [localSessions, setLocalSessions] = useState<Session[]>(sessions);
  const { user } = useAuth();

  const handleToggleActive = async (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newStatus = session.status === "active" ? "completed" : "active";
      
      const updatedLocalSessions = localSessions.map(s => 
        s.id === session.id ? { ...s, status: newStatus as "active" | "completed" } : s
      );
      setLocalSessions(updatedLocalSessions);

      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', session.id);

      if (error) throw error;

      const updatedSession = { ...session, status: newStatus as "active" | "completed" };
      onSessionUpdate(updatedSession);

      toast({
        title: "Status updated",
        description: `Session marked as ${newStatus}`,
      });
    } catch (error: any) {
      setLocalSessions(localSessions);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the session "${session.location}"?`)) {
      try {
        onDelete(session.id);
        toast({
          title: "Session deleted",
          description: "The session has been successfully deleted",
        });
      } catch (error: any) {
        toast({
          title: "Error deleting session",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {localSessions.map((session) => (
        <div
          key={session.id}
          className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
            selectedSession?.id === session.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(session)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">{session.location}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {session.id}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{session.date}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              session.status === "active" 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-700"
            }`}>
              {session.status}
            </span>
            
            {(user?.role === "admin" || user?.role === "both") && (
              <>
                <Toggle
                  pressed={session.status === "completed"}
                  onPressedChange={(pressed) => handleToggleActive(session, { stopPropagation: () => {} } as React.MouseEvent)}
                  className="data-[state=on]:bg-green-500"
                >
                  {session.status === "active" ? "Complete" : "Reactivate"}
                </Toggle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => handleDelete(session, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}