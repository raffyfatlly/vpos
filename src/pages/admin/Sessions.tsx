import { Session } from "@/types/pos";
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
import { useSessionManagement } from "@/hooks/useSessionManagement";

const Sessions = () => {
  const {
    isCreating,
    setIsCreating,
    editingSession,
    setEditingSession,
    selectedSession,
    setSelectedSession,
    sessions,
    isLoading,
    handleCreateSession,
    handleEditSession,
    handleDeleteSession,
    handleUpdateStock,
  } = useSessionManagement();
  
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin" && user.role !== "both") {
    return <Navigate to="/" replace />;
  }

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
              onSessionUpdate={handleEditSession}
              onSelect={(session) => {
                setSelectedSession(session);
                if (isMobile) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              selectedSession={selectedSession}
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
                onUpdateStock={handleUpdateStock}
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
          onSubmit={handleCreateSession}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingSession && (
        <SessionFormModal
          session={editingSession}
          onSubmit={handleEditSession}
          onCancel={() => setEditingSession(null)}
        />
      )}
    </SessionLayout>
  );
};

export default Sessions;