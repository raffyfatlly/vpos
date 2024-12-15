import { useState } from "react";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Toggle } from "@/components/ui/toggle";

export function SessionList({ 
  sessions, 
  onSessionUpdate,
  onSelect,
  selectedSession 
}: { 
  sessions: Session[]; 
  onSessionUpdate: (updatedSession: Session) => void;
  onSelect: (session: Session) => void;
  selectedSession: Session | null;
}) {
  const { toast } = useToast();
  const [localSessions, setLocalSessions] = useState<Session[]>(sessions);

  const handleToggleActive = async (session: Session, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    try {
      const newStatus = session.status === "active" ? "completed" : "active";
      
      // Update local state immediately for UI feedback
      const updatedLocalSessions = localSessions.map(s => 
        s.id === session.id ? { ...s, status: newStatus as "active" | "completed" } : s
      );
      setLocalSessions(updatedLocalSessions);

      // Update in database
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', session.id);

      if (error) throw error;

      // Call the parent update handler
      const updatedSession = { ...session, status: newStatus as "active" | "completed" };
      onSessionUpdate(updatedSession);

      toast({
        title: "Status updated",
        description: `Session marked as ${newStatus}`,
      });
    } catch (error: any) {
      // Revert local state on error
      setLocalSessions(localSessions);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {localSessions.map((session) => (
        <div
          key={session.id}
          className={`flex items-center justify-between p-4 bg-white rounded-lg shadow transition-all duration-200 cursor-pointer hover:shadow-md ${
            selectedSession?.id === session.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(session)}
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{session.name}</h3>
            <p className="text-sm text-muted-foreground mb-0.5">{session.date}</p>
            <p className="text-sm text-muted-foreground">{session.location}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${
              session.status === "active" ? "text-green-600" : "text-gray-600"
            }`}>
              {session.status}
            </span>
            
            <Toggle
              pressed={session.status === "completed"}
              onPressedChange={(pressed) => handleToggleActive(session, { stopPropagation: () => {} } as React.MouseEvent)}
              className="data-[state=on]:bg-green-500"
            >
              {session.status === "active" ? "Mark Complete" : "Reactivate"}
            </Toggle>
          </div>
        </div>
      ))}
    </div>
  );
}