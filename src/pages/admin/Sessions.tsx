import { useState } from "react";
import { Session } from "@/types/pos";
import { SessionForm } from "@/components/admin/SessionForm";
import { SessionList } from "@/components/admin/SessionList";
import { SessionDetails } from "@/components/admin/SessionDetails";
import { useSessions } from "@/hooks/useSessions";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SessionHeader } from "@/components/admin/sessions/SessionHeader";
import { SessionLayout } from "@/components/admin/sessions/SessionLayout";
import { SessionGrid } from "@/components/admin/sessions/SessionGrid";
import { SessionPanel } from "@/components/admin/sessions/SessionPanel";

const Sessions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    sessions,
    isLoading,
    createSession,
    updateSession,
    deleteSession,
  } = useSessions();

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

  const handleCreateSession = async (sessionData: Session) => {
    try {
      const newSession = await createSession.mutateAsync(sessionData);
      setIsCreating(false);
      setSelectedSession(newSession);
      toast({
        title: "Success",
        description: "Session created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditSession = async (sessionData: Session) => {
    try {
      await updateSession.mutateAsync(sessionData);
      setEditingSession(null);
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
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
      await deleteSession.mutateAsync(sessionId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStock = async (productId: number, newStock: number) => {
    if (!selectedSession) return;

    const updatedProducts = selectedSession.products.map(product =>
      product.id === productId
        ? { ...product, current_stock: newStock }
        : product
    );

    const updatedSession = {
      ...selectedSession,
      products: updatedProducts,
    };

    try {
      const { error } = await supabase
        .from('sessions')
        .update({
          products: updatedProducts
        })
        .eq('id', selectedSession.id);

      if (error) throw error;

      await updateSession.mutateAsync(updatedSession);
      setSelectedSession(updatedSession);
      
      toast({
        title: "Stock Updated",
        description: "Product stock has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SessionLayout>
      <SessionHeader onCreateClick={() => setIsCreating(true)} />
      
      <SessionGrid>
        <SessionPanel title="All Sessions">
          <SessionList
            sessions={sessions}
            onSessionUpdate={updateSession.mutateAsync}
            onSelect={setSelectedSession}
            selectedSession={selectedSession}
            onDelete={handleDeleteSession}
          />
        </SessionPanel>
        
        {selectedSession ? (
          <SessionPanel 
            title={selectedSession.location}
            subtitle={selectedSession.date}
          >
            <SessionDetails
              session={selectedSession}
              onUpdateStock={handleUpdateStock}
            />
          </SessionPanel>
        ) : (
          <SessionPanel title="Session Details">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a session to view details
            </div>
          </SessionPanel>
        )}
      </SessionGrid>

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
    </SessionLayout>
  );
};

export default Sessions;