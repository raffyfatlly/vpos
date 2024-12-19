import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';

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
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createSession = useMutation({
    mutationFn: async (sessionData: { location: string; date: string }) => {
      // Generate a simple, unique session ID
      const sessionId = `S${Date.now()}-${nanoid(6)}`;
      
      const newSession = {
        id: sessionId,
        name: sessionId,
        location: sessionData.location,
        date: sessionData.date,
        status: "active",
      };

      const { data, error } = await supabase
        .from("sessions")
        .insert(newSession)
        .select()
        .single();

      if (error) throw error;

      // After creating the session, initialize inventory for all products
      const { data: products } = await supabase
        .from("products")
        .select("id");

      if (products && products.length > 0) {
        const inventoryData = products.map(product => ({
          session_id: sessionId,
          product_id: product.id,
          initial_stock: 0,
          current_stock: 0,
        }));

        const { error: inventoryError } = await supabase
          .from("session_inventory")
          .insert(inventoryData);

        if (inventoryError) throw inventoryError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "Success",
        description: "Session created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Session creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    sessions,
    isLoading,
    error,
    createSession,
  };
}