import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Session } from "@/types/pos";
import { nanoid } from 'nanoid';

export function useSessions() {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createSession = useMutation({
    mutationFn: async (sessionData: Partial<Session>) => {
      const sessionId = `S${Date.now()}-${nanoid(6).toUpperCase()}`;
      const newSession = {
        id: sessionId,
        name: sessionId,
        ...sessionData,
        status: "active",
      };

      const { data, error } = await supabase
        .from('sessions')
        .insert([newSession])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const updateSession = useMutation({
    mutationFn: async (sessionData: Session) => {
      const { data, error } = await supabase
        .from('sessions')
        .update(sessionData)
        .eq('id', sessionData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  return {
    sessions,
    isLoading,
    error,
    refetch,
    createSession,
    updateSession,
    deleteSession,
  };
}