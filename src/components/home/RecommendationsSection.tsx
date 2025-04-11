
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from '@/components/ItemCard';
import { formatDistanceToNow } from 'date-fns';

type Item = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
  category: string;
};

const RecommendationsSection = () => {
  const { user } = useAuth();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Format the relative time for display
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Query to fetch recommended items
  const { data: recommendedItems, isLoading } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Fetch the user's recent searches
        const { data: searches } = await supabase
          .from('user_searches')
          .select('search_query')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        // Fetch the user's profile to get interests
        const { data: profile } = await supabase
          .from('profiles')
          .select('university')
          .eq('id', user.id)
          .single();
          
        // Create a recommendation algorithm based on search history and campus
        let query = supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at, category')
          .limit(6);
          
        // If we have search history, use it to filter items
        if (searches && searches.length > 0) {
          const keywords = searches.flatMap(s => 
            s.search_query.toLowerCase().split(' ')
          );
          
          if (keywords.length > 0) {
            // Filter items that match recent search keywords
            query = query.or(
              keywords.map(keyword => 
                `title.ilike.%${keyword}%,category.ilike.%${keyword}%`
              ).join(',')
            );
          }
        }
        
        // If user is from a specific campus, prioritize items from there
        if (profile?.university) {
          query = query.or(`location.ilike.%${profile.university}%`);
        }
        
        // Add final ordering and fetch
        const { data, error } = await query
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // If user is not logged in, show a simple message
  if (!user) {
    return null;
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">🎯 Recommended For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-3/4 h-5 rounded" />
              <Skeleton className="w-1/2 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // If there are no recommendations yet, don't show the section
  if (!recommendedItems || recommendedItems.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="mt-10"
    >
      <h2 className="text-2xl font-semibold mb-6">🎯 Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendedItems.map((item) => (
          <motion.div 
            key={item.id} 
            variants={fadeInUp}
            className="hover:-translate-y-1 transition-all duration-200"
          >
            <ItemCard 
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image_url || ''}
              location={item.location}
              date={formatRelativeTime(item.created_at)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationsSection;
