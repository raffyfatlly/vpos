import { useState, useEffect } from "react";
import { Session, SessionProduct } from "@/types/pos";
import { supabase } from "@/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useInventoryUpdates(initialSession: Session, onSessionUpdate: (session: Session) => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const productsChannel = supabase
      .channel('product_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        async (payload: RealtimePostgresChangesPayload<{ id: number; initial_stock: number; current_stock: number }>) => {
          console.log('Product update received:', payload);
          
          if (isUpdating) return;

          try {
            if (!payload.new?.id) {
              console.error('Invalid payload received:', payload);
              return;
            }

            const { data: updatedProduct, error: productError } = await supabase
              .from('products')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (productError) throw productError;

            onSessionUpdate({
              ...initialSession,
              products: initialSession.products.map(product =>
                product.id === updatedProduct.id
                  ? {
                      ...product,
                      initial_stock: updatedProduct.initial_stock,
                      current_stock: updatedProduct.current_stock
                    }
                  : product
              )
            });
          } catch (error) {
            console.error('Error handling product update:', error);
          }
        }
      )
      .subscribe();

    const sessionChannel = supabase
      .channel('session_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${initialSession.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<{ id: string }>) => {
          console.log('Session update received:', payload);
          
          if (isUpdating) return;

          try {
            const { data: sessionData, error: sessionError } = await supabase
              .from('sessions')
              .select('*')
              .eq('id', initialSession.id)
              .single();

            if (sessionError) throw sessionError;

            onSessionUpdate(sessionData);
          } catch (error) {
            console.error('Error handling session update:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [initialSession, isUpdating]);

  return { isUpdating, setIsUpdating };
}