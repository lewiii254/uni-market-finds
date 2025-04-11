
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseSearchHistoryProps {
  query: string;
  isSearching: boolean;
}

// Update database schema to include user_searches table
// This requires running SQL via the Supabase dashboard:
// CREATE TABLE IF NOT EXISTS public.user_searches (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
//   search_query text NOT NULL,
//   created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
// );

export function useSearchHistory({ query, isSearching }: UseSearchHistoryProps) {
  const { user } = useAuth();
  
  useEffect(() => {
    // Only track search when user is logged in, query isn't empty, and search was executed
    if (user && query.trim() && isSearching) {
      const trackSearch = async () => {
        try {
          // We need to create the user_searches table in Supabase first
          // For now, just log the search and don't attempt to insert
          console.log('Would track search:', {
            user_id: user.id,
            search_query: query.trim().toLowerCase()
          });
          
          // Uncomment after creating the table:
          // await supabase.from('user_searches').insert({
          //   user_id: user.id,
          //   search_query: query.trim().toLowerCase()
          // });
        } catch (error) {
          console.error('Error tracking search:', error);
        }
      };
      
      trackSearch();
    }
  }, [query, isSearching, user]);
  
  return null;
}
