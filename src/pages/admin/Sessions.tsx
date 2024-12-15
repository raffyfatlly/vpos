import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Session } from "@/types/pos";
import { SessionForm } from "@/components/admin/SessionForm";
import { SessionList } from "@/components/admin/SessionList";
import { SessionDetails } from "@/components/admin/SessionDetails";
import { useSessions } from "@/hooks/useSessions";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-muted-foreground">Loading sessions...</div>
      </div>
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
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="h-full flex flex-col gap-6 max-w-[1600px] mx-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Sessions</h1>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-primary/5">
              <h2 className="text-lg font-semibold text-primary">All Sessions</h2>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(100vh-16rem)]">
              <SessionList
                sessions={sessions}
                onSessionUpdate={updateSession.mutateAsync}
                onSelect={setSelectedSession}
                selectedSession={selectedSession}
                onDelete={handleDeleteSession}
              />
            </div>
          </div>
          
          {selectedSession ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-primary/5">
                <h2 className="text-lg font-semibold text-primary">
                  {selectedSession.location}
                </h2>
                <p className="text-sm text-muted-foreground">{selectedSession.date}</p>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(100vh-16rem)]">
                <SessionDetails
                  session={selectedSession}
                  onUpdateStock={handleUpdateStock}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm flex items-center justify-center text-muted-foreground">
              Select a session to view details
            </div>
          )}
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
