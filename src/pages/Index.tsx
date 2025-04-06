
import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Categories from '@/components/Categories';
import ItemCard from '@/components/ItemCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

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

  // Fetch items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured items (highest priced items)
        const { data: featuredData, error: featuredError } = await supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at')
          .order('price', { ascending: false })
          .limit(4);
        
        if (featuredError) throw featuredError;
        
        // Fetch recent items (newest items)
        const { data: recentData, error: recentError } = await supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at')
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (recentError) throw recentError;
        
        setFeaturedItems(featuredData || []);
        setRecentItems(recentData || []);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">College Marketplace</h1>
          <p className="text-lg text-gray-600 mb-6">Buy and sell items within your university community</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/add-listing">
              <Button className="bg-marketplace-purple hover:bg-marketplace-darkPurple">
                Sell Something
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="outline">
                Browse Items
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Categories section */}
        <Categories />
        
        {/* Featured items section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Featured Items</h2>
            <Link to="/search" className="text-sm text-marketplace-purple hover:underline">View all</Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-52"></div>
              ))}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
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
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No featured items available</p>
              <Link to="/add-listing" className="mt-2 inline-block text-marketplace-purple hover:underline">
                Be the first to add an item!
              </Link>
            </div>
          )}
        </div>
        
        {/* Recent listings section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Recent Listings</h2>
            <Link to="/search" className="text-sm text-marketplace-purple hover:underline">View all</Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-52"></div>
              ))}
            </div>
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
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
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No recent items available</p>
              <Link to="/add-listing" className="mt-2 inline-block text-marketplace-purple hover:underline">
                Be the first to add an item!
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
