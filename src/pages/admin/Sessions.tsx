import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { SessionForm } from "@/components/admin/SessionForm";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { MOCK_SESSIONS } from "@/data/mockData";

const Sessions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);

  // Redirect if not logged in or not admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  const handleCreateSession = (sessionData: Session) => {
    setSessions([...sessions, sessionData]);
    toast({
      title: "Session created",
      description: "The session has been created successfully.",
    });
    setIsCreating(false);
  };

  const handleEditSession = (sessionData: Session) => {
    setSessions(sessions.map(s => s.id === sessionData.id ? sessionData : s));
    toast({
      title: "Session updated",
      description: "The session has been updated successfully.",
    });
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast({
      title: "Session deleted",
      description: "The session has been deleted successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

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
                    onClick={() => setEditingSession(session)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCreating && (
        <SessionForm
          onSubmit={handleCreateSession}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingSession && (
        <SessionForm
          session={editingSession}
          onSubmit={handleEditSession}
          onCancel={() => setEditingSession(null)}
        />
      )}
    </div>
  );
};

export default Sessions;