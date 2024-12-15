import { Session } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface SessionListProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onDelete: (sessionId: string) => void;
}

export function SessionList({ sessions, onEdit, onDelete }: SessionListProps) {
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
              className="p-4 flex items-center justify-between hover:bg-muted/50"
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
                  onClick={() => onEdit(session)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(session.id)}
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