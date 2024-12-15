import { useState } from "react";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Toggle } from "@/components/ui/toggle";

export default function SessionList({ sessions, onSessionUpdate }: { 
  sessions: Session[]; 
  onSessionUpdate: (updatedSession: Session) => void;
}) {
  const { toast } = useToast();
  const [localSessions, setLocalSessions] = useState<Session[]>(sessions);

  const handleToggleActive = async (session: Session) => {
    try {
      const newStatus = (session.status === "active" ? "completed" : "active") as const;
      
      // Update local state immediately for UI feedback
      const updatedLocalSessions = localSessions.map(s => 
        s.id === session.id ? { ...s, status: newStatus } : s
      );
      setLocalSessions(updatedLocalSessions);

      // Update in database
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', session.id);

      if (error) throw error;

      // Call the parent update handler
      onSessionUpdate({ ...session, status: newStatus });

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
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow transition-all duration-200"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{session.name}</h3>
            <p className="text-sm text-muted-foreground">{session.date}</p>
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
              onPressedChange={() => handleToggleActive(session)}
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