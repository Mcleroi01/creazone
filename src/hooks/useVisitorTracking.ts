import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const useVisitorTracking = (postId?: string) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const location = useLocation();
  const startTimeRef = useRef<Date>();
  const visitorIdRef = useRef<string>();

  // Générer ou récupérer un ID visiteur
  useEffect(() => {
    const getOrCreateVisitorId = async () => {
      let visitorId = localStorage.getItem('visitorId');
      
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('visitorId', visitorId);
      }
      
      visitorIdRef.current = visitorId;
      
      // Enregistrer ou mettre à jour le visiteur
      const { error } = await supabase
        .from('visitors')
        .upsert(
          {
            visitor_id: visitorId,
            last_seen_at: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
          },
          { onConflict: 'visitor_id' }
        );

      if (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    getOrCreateVisitorId();
  }, []);

  // Suivi du temps passé sur la page
  useEffect(() => {
    if (!visitorIdRef.current) return;

    // Démarrer le suivi
    const startTracking = async () => {
      startTimeRef.current = new Date();
      
      // Vérifier si ce visiteur a déjà vu cet article
    const { data: existingVisit, error: visitError } = await supabase
      .from('page_views')
      .select('id')
      .eq('visitor_id', visitorIdRef.current)
      .eq('post_id', postId)
      .maybeSingle();

    if (visitError) {
      console.error('Error checking existing visit:', visitError);
      return;
    }
    
    // Si le visiteur a déjà vu cet article, on ne fait rien
    if (existingVisit) {
      return;
    }

    // Vérifier si c'est un visiteur de retour (a déjà visité d'autres pages)
    const { data: otherVisits } = await supabase
      .from('page_views')
      .select('id')
      .eq('visitor_id', visitorIdRef.current)
      .neq('post_id', postId);
    
    const isReturningVisitor = (otherVisits?.length || 0) > 0;

    // Enregistrer la vue de la page
    const { data, error } = await supabase
      .from('page_views')
      .insert({
        visitor_id: visitorIdRef.current,
        url: window.location.href,
        path: location.pathname,
        post_id: postId || null,
        view_started_at: startTimeRef.current.toISOString(),
        is_returning_visitor: isReturningVisitor,
      })
      .select()
      .single();

      if (error) {
        console.error('Error tracking page view:', error);
        return;
      }

      // Mettre à jour le temps passé sur la page lors du déchargement
      const handleUnload = async () => {
        if (!startTimeRef.current || !data?.id) return;
        
        const timeSpent = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        
        await supabase
          .from('page_views')
          .update({
            view_ended_at: new Date().toISOString(),
            time_on_page: timeSpent,
            is_bounce: timeSpent < 5, // Moins de 5 secondes = rebond
          })
          .eq('id', data.id);
      };

      window.addEventListener('beforeunload', handleUnload);
      
      // Nettoyer l'écouteur d'événement
      return () => {
        window.removeEventListener('beforeunload', handleUnload);
        if (startTimeRef.current && data?.id) {
          const timeSpent = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
          
          supabase
            .from('page_views')
            .update({
              view_ended_at: new Date().toISOString(),
              time_on_page: timeSpent,
              is_bounce: timeSpent < 5,
            })
            .eq('id', data.id);
        }
      };
    };

    startTracking();
  }, [location.pathname, postId]);

  // Get unique view count for a post (counts each visitor only once)
  const getPostViewCount = useCallback(async (postId: string): Promise<number> => {
    if (!postId) return 0;
    
    const { count, error } = await supabase
      .from('page_views')
      .select('visitor_id', { count: 'exact', head: true })
      .eq('post_id', postId);
      
    if (error) {
      console.error('Error fetching view count:', error);
      return 0;
    }
    
    return count || 0;
  }, []);

  // Update view count when postId changes
  useEffect(() => {
    if (postId) {
      getPostViewCount(postId).then(count => setViewCount(count));
    }
  }, [postId, getPostViewCount]);

  return { viewCount, getPostViewCount };
};
