import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@/types/pos";
import { MOCK_SESSIONS } from "@/data/mockData";
import SessionForm from "@/components/admin/SessionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const { toast } = useToast();

  const handleCreateSession = (newSession: Session) => {
    setSessions((prev) => [...prev, { ...newSession, id: Date.now().toString() }]);
    toast({
      title: "Success",
      description: "Session created successfully",
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    toast({
      title: "Success",
      description: "Session deleted successfully",
    });
  };

  const handleEditSession = (updatedSession: Session) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
    toast({
      title: "Success",
      description: "Session updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
            </DialogHeader>
            <SessionForm onSubmit={handleCreateSession} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white p-6 rounded-lg shadow-sm border space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{session.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {session.date} • {session.time}
                </p>
                <p className="text-sm text-muted-foreground">{session.location}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Session</DialogTitle>
                    </DialogHeader>
                    <SessionForm
                      session={session}
                      onSubmit={handleEditSession}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sessions;