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
  const { user } = useAuth();

  const handleToggleActive = async (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newStatus = session.status === "active" ? "completed" : "active";
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
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`group flex flex-col sm:flex-row items-start sm:items-center min-h-[4rem] gap-2 p-3 bg-white rounded-lg border transition-all duration-200 cursor-pointer hover:border-primary/50 hover:shadow-md overflow-hidden ${
            selectedSession?.id === session.id ? 'border-primary shadow-md' : 'border-border'
          }`}
          onClick={() => onSelect(session)}
        >
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {session.location}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary whitespace-nowrap">
                  {session.id}
                </span>
                <span className="text-xs text-muted-foreground">{session.date}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                session.status === "active" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-700"
              }`}>
                {session.status}
              </span>
              
              {(user?.role === "admin" || user?.role === "both") && (
                <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Toggle
                    pressed={session.status === "completed"}
                    onPressedChange={() => handleToggleActive(session, { stopPropagation: () => {} } as React.MouseEvent)}
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
        </div>
      ))}
    </div>
  );
}