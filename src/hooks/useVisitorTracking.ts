import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const useVisitorTracking = (postId?: string) => {
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
      
      // Vérifier si c'est un visiteur de retour
      const { data: existingVisits, error: visitError } = await supabase
        .from('page_views')
        .select('id')
        .eq('visitor_id', visitorIdRef.current)
        .eq('path', location.pathname);

      if (visitError) {
        console.error('Error checking existing visit:', visitError);
        return;
      }
      
      const isReturningVisitor = (existingVisits?.length || 0) > 0;

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

  return null;
};
