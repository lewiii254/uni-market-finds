
import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Categories from '@/components/Categories';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Import the components
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ItemsSection from '@/components/home/ItemsSection';
import CallToAction from '@/components/home/CallToAction';
import TestimonialsSection from '@/components/home/TestimonialsSection';

interface Item {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
}

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format the relative time for display
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Subscribe to real-time updates for new items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured items (highest priced items)
        const { data: featuredData, error: featuredError } = await supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at')
          .order('price', { ascending: false })
          .limit(12);
        
        if (featuredError) throw featuredError;
        
        // Fetch recent items (newest items)
        const { data: recentData, error: recentError } = await supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at')
          .order('created_at', { ascending: false })
          .limit(12);
          
        if (recentError) throw recentError;
        
        setFeaturedItems(featuredData || []);
        setRecentItems(recentData || []);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error loading items",
          description: "There was a problem loading the marketplace items.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();

    // Subscribe to real-time inserts to update the recent listings immediately
    const channel = supabase
      .channel('public:items')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'items' 
        }, 
        (payload) => {
          console.log('New item added:', payload);
          // Add the new item to the recent items list
          if (payload.new) {
            const newItem = payload.new as Item;
            setRecentItems(prevItems => [newItem, ...prevItems.slice(0, 11)]);
            
            // If the new item is expensive enough, it might belong in featured items too
            if (newItem.price && featuredItems.length > 0 && 
                newItem.price >= featuredItems[featuredItems.length - 1].price) {
              // Re-fetch featured items to ensure proper sorting
              supabase
                .from('items')
                .select('id, title, price, image_url, location, created_at')
                .order('price', { ascending: false })
                .limit(12)
                .then(({ data }) => {
                  if (data) setFeaturedItems(data);
                });
            }
          }
        })
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageLayout>
      <div className="space-y-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features section */}
        <FeaturesSection />
        
        {/* Categories section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="py-4"
        >
          <h2 className="text-2xl font-semibold text-center mb-4">🔍 Browse Categories</h2>
          <Categories />
        </motion.div>
        
        {/* Items section with tabs */}
        <ItemsSection 
          featuredItems={featuredItems} 
          recentItems={recentItems} 
          isLoading={isLoading}
          formatRelativeTime={formatRelativeTime}
        />
        
        {/* Call to action */}
        <CallToAction />

        {/* Testimonials section */}
        <TestimonialsSection />
      </div>
    </PageLayout>
  );
};

export default HomePage;
