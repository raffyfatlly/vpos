import { Session } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SessionListProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onDelete: (sessionId: string) => void;
  onSelect: (session: Session) => void;
  selectedSession: Session | null;
}

export function SessionList({
  sessions,
  onEdit,
  onDelete,
  onSelect,
  selectedSession,
}: SessionListProps) {
  const { toast } = useToast();

  const handleToggleActive = async (session: Session) => {
    try {
      const newStatus = session.status === "active" ? "completed" : "active";
      
      // Create updated session object
      const updatedSession = {
        ...session,
        status: newStatus
      };

      // Update local state immediately
      onSelect(updatedSession);

      // Update the database
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', session.id);

      if (error) {
        // If database update fails, revert the local state
        onSelect(session);
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Session is now ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating session status:', error);
      toast({
        title: "Error",
        description: "Failed to update session status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-xl shadow-lg bg-white overflow-hidden">
      {sessions.length === 0 ? (
        <div className="p-6">
          <p className="text-muted-foreground text-center">No sessions found.</p>
        </div>
      ) : (
        <div className="divide-y">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "p-6 flex items-center justify-between hover:bg-gray-50/50 cursor-pointer transition-all duration-200",
                selectedSession?.id === session.id && "bg-gray-50"
              )}
              onClick={() => onSelect(session)}
            >
              <div className="space-y-2">
                <div className="font-display text-lg font-semibold tracking-tight">
                  {session.location}
                </div>
                <div className="text-sm text-muted-foreground">
                  {session.date}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  ID: {session.id}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={session.status === "active"}
                    onCheckedChange={() => handleToggleActive(session)}
                    onClick={(e) => e.stopPropagation()}
                    className="data-[state=checked]:bg-green-500 transition-all duration-200"
                  />
                  <span className={cn(
                    "text-sm font-medium transition-all duration-200",
                    session.status === "active" ? "text-green-600" : "text-muted-foreground"
                  )}>
                    {session.status === "active" ? "Active" : "Completed"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(session);
                    }}
                    className="hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(session.id);
                    }}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}