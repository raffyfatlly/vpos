import { Session } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
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
      const newStatus = session.status === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', session.id);

      if (error) throw error;

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
    <div className="border rounded-lg shadow-lg bg-white">
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
                "p-6 flex items-center justify-between hover:bg-gray-50/50 cursor-pointer transition-colors",
                selectedSession?.id === session.id && "bg-gray-50"
              )}
              onClick={() => onSelect(session)}
            >
              <div className="space-y-2">
                <div className="font-semibold text-lg">{session.location}</div>
                <div className="text-sm text-muted-foreground">
                  {session.date}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {session.id}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Toggle
                  pressed={session.status === "active"}
                  onPressedChange={() => handleToggleActive(session)}
                  className="data-[state=on]:bg-green-500 data-[state=on]:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  {session.status === "active" ? "Active" : "Inactive"}
                </Toggle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(session);
                    }}
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