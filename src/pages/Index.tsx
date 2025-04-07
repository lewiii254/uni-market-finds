
import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Categories from '@/components/Categories';
import ItemCard from '@/components/ItemCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Search, TrendingUp, Tag, Users, ShieldCheck } from 'lucide-react';

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageLayout>
      <div className="space-y-10">
        {/* Hero section with enhanced design */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-6 md:py-20 md:px-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold mb-2"
              variants={fadeInUp}
            >
              Campus Marketplace
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-8"
              variants={fadeInUp}
            >
              Buy, sell, and discover amazing deals within your university community
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Link to="/add-listing">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 font-medium">
                  Sell Something
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Items
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Features section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-8"
        >
          <h2 className="text-2xl font-semibold text-center mb-8">Why Use Campus Marketplace?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Community Based", description: "Trade with fellow students you can trust" },
              { icon: Tag, title: "Great Deals", description: "Find bargains on textbooks, electronics & more" },
              { icon: TrendingUp, title: "Quick & Easy", description: "List items in minutes and sell fast" },
              { icon: ShieldCheck, title: "Secure", description: "Safe transactions within your campus" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="bg-marketplace-purple/10 p-3 rounded-full mb-3">
                  <feature.icon className="h-6 w-6 text-marketplace-purple" />
                </div>
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Categories section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Categories />
        </motion.div>
        
        {/* Featured items section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Featured Items</h2>
            <Link to="/search" className="text-sm text-marketplace-purple hover:underline flex items-center">
              View all 
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-52"></div>
              ))}
            </div>
          ) : featuredItems.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {featuredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
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
            </motion.div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No featured items available</p>
              <Link to="/add-listing" className="mt-2 inline-block text-marketplace-purple hover:underline">
                Be the first to add an item!
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Recent listings section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Listings</h2>
            <Link to="/search" className="text-sm text-marketplace-purple hover:underline flex items-center">
              View all
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-52"></div>
              ))}
            </div>
          ) : recentItems.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {recentItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
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
            </motion.div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No recent items available</p>
              <Link to="/add-listing" className="mt-2 inline-block text-marketplace-purple hover:underline">
                Be the first to add an item!
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Call to action */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="bg-gray-50 rounded-2xl p-8 text-center space-y-4"
        >
          <h2 className="text-2xl font-semibold">Ready to sell your items?</h2>
          <p className="text-gray-600">Get started in minutes and reach thousands of students on campus</p>
          <Link to="/add-listing">
            <Button size="lg" className="bg-marketplace-purple hover:bg-marketplace-darkPurple mt-2">
              List Your Item
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
