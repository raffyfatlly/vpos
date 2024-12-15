import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

export function useSessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: sessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      console.log("Fetching sessions from database");
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      console.log("Fetched sessions:", data);
      return data;
    },
  });

  const createSession = useMutation({
    mutationFn: async (sessionData: Session) => {
      const { data, error } = await supabase
        .from("sessions")
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newSession) => {
      queryClient.setQueryData(["sessions"], (old: Session[] = []) => [...old, newSession]);
      toast({
        title: "Session created",
        description: "The session has been created successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
    },
  });

  const updateSession = useMutation({
    mutationFn: async (sessionData: Session) => {
      console.log("Updating session in database:", sessionData);
      const { data, error } = await supabase
        .from("sessions")
        .update(sessionData)
        .eq("id", sessionData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedSession) => {
      // Immediately update the cache with the new data
      queryClient.setQueryData(["sessions"], (old: Session[] = []) => 
        old.map(session => session.id === updatedSession.id ? updatedSession : session)
      );
      
      // Prevent automatic background refetch for a short period
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
        refetchType: "none"
      });

      toast({
        title: "Session updated",
        description: "The session has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: "Failed to update session",
        variant: "destructive",
      });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;
      return sessionId;
    },
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previousSessions = queryClient.getQueryData(["sessions"]);
      queryClient.setQueryData(["sessions"], (old: Session[] = []) => 
        old.filter(session => session.id !== sessionId)
      );
      return { previousSessions };
    },
    onError: (err, sessionId, context) => {
      queryClient.setQueryData(["sessions"], context?.previousSessions);
      console.error("Error deleting session:", err);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Session deleted",
        description: "The session has been deleted successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return {
    sessions,
    isLoading,
    error,
    createSession,
    updateSession,
    deleteSession,
  };
}