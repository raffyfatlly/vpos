import { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Session } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

export const useSessionRealtime = (
  currentSession: Session | null,
  setCurrentSession: (session: Session | null) => void,
  setSessionProducts: (products: any[]) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!currentSession) return;

    console.log('Setting up real-time subscriptions for session:', currentSession.id);
    
    // Listen for session updates including sales
    const channel = supabase
      .channel(`session_${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${currentSession.id}`,
        },
        async (payload: any) => {
          console.log('Received session update:', payload);
          
          if (payload.new) {
            const updatedSession = payload.new;
            
            // Check if status changed to completed
            if (updatedSession.status === 'completed') {
              toast({
                title: "Session completed",
                description: "This session has been marked as completed. Returning to session selection.",
              });
              setCurrentSession(null);
              return;
            }

            // Update session with new data, preserving the sales array
            setCurrentSession({
              ...currentSession,
              ...updatedSession,
              // Ensure sales array is preserved and updated
              sales: updatedSession.sales || currentSession.sales || []
            });

            // If products were updated, update the local products state
            if (updatedSession.products) {
              setSessionProducts(updatedSession.products);
              toast({
                title: "Stock updated",
                description: "Product stock has been updated",
              });
            }
          }
        }
      )
      .subscribe();

    // Listen for inventory updates
    const inventoryChannel = supabase
      .channel(`inventory_${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_inventory',
          filter: `session_id=eq.${currentSession.id}`,
        },
        async () => {
          const { data: inventoryData, error: inventoryError } = await supabase
            .from('session_inventory')
            .select('*')
            .eq('session_id', currentSession.id);

          if (inventoryError) {
            console.error('Error fetching updated inventory:', inventoryError);
            return;
          }

          const updatedProducts = currentSession.products.map(product => {
            const inventory = inventoryData?.find(inv => inv.product_id === product.id);
            return {
              ...product,
              initial_stock: inventory?.initial_stock ?? 0,
              current_stock: inventory?.current_stock ?? 0
            };
          });

          setSessionProducts(updatedProducts);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(inventoryChannel);
    };
  }, [currentSession?.id]);
};