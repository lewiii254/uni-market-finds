
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseSearchHistoryProps {
  query: string;
  isSearching: boolean;
}

export function useSearchHistory({ query, isSearching }: UseSearchHistoryProps) {
  const { user } = useAuth();
  
  useEffect(() => {
    // Only track search when user is logged in, query isn't empty, and search was executed
    if (user && query.trim() && isSearching) {
      const trackSearch = async () => {
        try {
          // Add search to history
          await supabase.from('user_searches').insert({
            user_id: user.id,
            search_query: query.trim().toLowerCase()
          });
        } catch (error) {
          console.error('Error tracking search:', error);
        }
      };
      
      trackSearch();
    }
  }, [query, isSearching, user]);
  
  return null;
}
