import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { SessionForm } from "@/components/admin/SessionForm";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Sessions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if not logged in or not admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  const handleCreateSession = (sessionData: Omit<Session, "id">) => {
    // TODO: Implement session creation logic
    console.log("Creating session:", sessionData);
    toast({
      title: "Session created",
      description: "The session has been created successfully.",
    });
    setIsCreating(false);
  };

  const handleEditSession = (sessionData: Session) => {
    // TODO: Implement session editing logic
    console.log("Editing session:", sessionData);
    toast({
      title: "Session updated",
      description: "The session has been updated successfully.",
    });
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    // TODO: Implement session deletion logic
    console.log("Deleting session:", sessionId);
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
        <div className="p-4">
          <p className="text-muted-foreground">No sessions found.</p>
        </div>
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