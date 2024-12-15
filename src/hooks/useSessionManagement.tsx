import { useState } from "react";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useSessions } from "@/hooks/useSessions";

export function useSessionManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const {
    sessions,
    isLoading,
    createSession,
    updateSession,
    deleteSession,
  } = useSessions();

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

    try {
      const { error } = await supabase
        .from('sessions')
        .update({
          products: updatedProducts
        })
        .eq('id', selectedSession.id);

      if (error) throw error;

      const updatedSession = {
        ...selectedSession,
        products: updatedProducts,
      };

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

  return {
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
  };
}