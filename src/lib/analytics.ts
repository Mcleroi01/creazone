import { supabase } from './supabase';

export const trackPageView = async (pagePath: string) => {
  try {
    // Get the current user ID if available
    const { data: { user } } = await supabase.auth.getUser();
    
    // Record the page view in your analytics table
    await supabase
      .from('analytics')
      .insert([
        { 
          event_type: 'page_view',
          page: pagePath,
          user_id: user?.id || null,
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
          referrer: typeof document !== 'undefined' ? document.referrer : null
        },
      ]);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};
