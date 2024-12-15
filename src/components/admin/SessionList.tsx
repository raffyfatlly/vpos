import { Session } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="border rounded-lg">
      {sessions.length === 0 ? (
        <div className="p-4">
          <p className="text-muted-foreground">No sessions found.</p>
        </div>
      ) : (
        <div className="divide-y">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer",
                selectedSession?.id === session.id && "bg-muted"
              )}
              onClick={() => onSelect(session)}
            >
              <div className="space-y-1">
                <div className="font-medium">{session.location}</div>
                <div className="text-sm text-muted-foreground">
                  {session.date}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {session.id}
                </div>
              </div>
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
          ))}
        </div>
      )}
    </div>
  );
}