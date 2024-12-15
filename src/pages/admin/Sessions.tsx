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
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading sessions...</div>
      </div>
    );
  }

  const handleCreateSession = async (sessionData: Session) => {
    await createSession.mutateAsync(sessionData);
    setIsCreating(false);
  };

  const handleEditSession = async (sessionData: Session) => {
    await updateSession.mutateAsync(sessionData);
    setEditingSession(null);
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession.mutateAsync(sessionId);
    setSelectedSession(null);
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
        description: "Product stock has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
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

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <SessionList
            sessions={sessions}
            onSessionUpdate={updateSession.mutateAsync}
          />
        </div>
        
        {selectedSession && (
          <div className="border rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{selectedSession.location}</h2>
              <p className="text-muted-foreground">{selectedSession.date}</p>
            </div>
            <SessionDetails
              session={selectedSession}
              onUpdateStock={handleUpdateStock}
            />
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
