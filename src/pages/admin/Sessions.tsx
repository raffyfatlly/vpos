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
    <div className="container mx-auto p-6 max-w-[1600px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <SessionList
            sessions={sessions}
            onSessionUpdate={updateSession.mutateAsync}
            onSelect={setSelectedSession}
            selectedSession={selectedSession}
            onDelete={handleDeleteSession}
          />
        </div>
        
        {selectedSession && (
          <div className="w-full bg-white rounded-lg shadow-sm p-6">
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