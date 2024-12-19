import { useState } from "react";
import { SessionFormModal } from "@/components/admin/sessions/form/SessionFormModal";
import { SessionList } from "@/components/admin/SessionList";
import { SessionDetailsView } from "@/components/admin/sessions/details/SessionDetailsView";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { SessionHeader } from "@/components/admin/sessions/SessionHeader";
import { SessionLayout } from "@/components/admin/sessions/SessionLayout";
import { SessionGrid } from "@/components/admin/sessions/SessionGrid";
import { SessionPanel } from "@/components/admin/sessions/SessionPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Session } from "@/types/pos";
import { useSessions } from "@/hooks/useSessions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Sessions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { sessions, isLoading, refetch } = useSessions();
  const { toast } = useToast();
  
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

  const handleSessionUpdate = async (updatedSession: Session) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update(updatedSession)
        .eq('id', updatedSession.id);

      if (error) throw error;

      refetch();
      toast({
        title: "Success",
        description: "Session updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
      
      refetch();
      toast({
        title: "Success",
        description: "Session deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <SessionLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading sessions...</div>
        </div>
      </SessionLayout>
    );
  }

  return (
    <SessionLayout>
      <SessionHeader onCreateClick={() => setIsCreating(true)} />
      
      <SessionGrid>
        {(!isMobile || !selectedSession) && (
          <SessionPanel 
            title="All Sessions" 
            height={isMobile ? "large" : "default"}
          >
            <SessionList
              sessions={sessions}
              onSelect={(session) => {
                setSelectedSession(session);
                if (isMobile) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              selectedSession={selectedSession}
              onSessionUpdate={handleSessionUpdate}
              onDelete={handleDeleteSession}
            />
          </SessionPanel>
        )}
        
        {(!isMobile || selectedSession) && (
          <SessionPanel 
            title={selectedSession?.location || "Session Details"}
            subtitle={selectedSession?.date}
            height="large"
          >
            {selectedSession ? (
              <SessionDetailsView
                session={selectedSession}
                onBack={() => setSelectedSession(null)}
                isMobile={isMobile}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a session to view details
              </div>
            )}
          </SessionPanel>
        )}
      </SessionGrid>

      {isCreating && (
        <SessionFormModal
          onCancel={() => setIsCreating(false)}
        />
      )}
    </SessionLayout>
  );
};

export default Sessions;