import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function useSessions() {
  const { toast } = useToast();

  const {
    data: sessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load sessions",
          variant: "destructive",
        });
        throw error;
      }
      
      return data || [];
    },
  });

  return {
    sessions,
    isLoading,
    error,
  };
}