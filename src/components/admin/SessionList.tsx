import { useState, useEffect } from "react";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Toggle } from "@/components/ui/toggle";
import { useAuth } from "@/hooks/useAuth";
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

  useEffect(() => {
    setLocalSessions(sessions);
  }, [sessions]);

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
        // Optimistically remove from local state
        setLocalSessions(prev => prev.filter(s => s.id !== session.id));
        onDelete(session.id);
      } catch (error: any) {
        // Restore the previous state if there's an error
        setLocalSessions(sessions);
        toast({
          title: "Error deleting session",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-3">
      {localSessions.map((session) => (
        <div
          key={session.id}
          className={`group flex items-center h-16 gap-2 px-3 py-2 bg-white rounded-lg border transition-all duration-200 cursor-pointer hover:border-primary/50 hover:shadow-md ${
            selectedSession?.id === session.id ? 'border-primary shadow-md' : 'border-border'
          }`}
          onClick={() => onSelect(session)}
        >
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {session.location}
            </h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary whitespace-nowrap">
              {session.id}
            </span>
            <p className="text-xs text-muted-foreground">{session.date}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
              session.status === "active" 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-700"
            }`}>
              {session.status}
            </span>
            
            {(user?.role === "admin" || user?.role === "both") && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
