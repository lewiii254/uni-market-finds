
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ItemCard from '@/components/ItemCard';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSearchHistory } from '@/hooks/useSearchHistory';

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Furniture",
  "Other"
];

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Date: Newest First', value: 'date_desc' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Use the search history hook to track searches
  useSearchHistory({
    query: searchQuery,
    isSearching: searchPerformed
  });
  
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setSearchPerformed(true);
      
      try {
        let query = supabase
          .from('items')
          .select('*')
          .ilike('title', `%${searchQuery}%`);
        
        if (category && category !== '') {
          query = query.eq('category', category);
        }
        
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        
        switch (sortBy) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'date_desc':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            // Implement relevance sort if possible, otherwise default to date
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setSearchResults(data || []);
      } catch (error: any) {
        console.error('Search error:', error);
        toast({
          title: 'Search Failed',
          description: error.message || 'An error occurred during the search',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [searchQuery, category, priceRange, sortBy, toast]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ 
      q: searchQuery,
      category: category,
      price_min: priceRange[0].toString(),
      price_max: priceRange[1].toString(),
      sort: sortBy
    });
  };
  
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto py-6"
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="search"
            placeholder="Search for items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/4 p-4 rounded-md border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FilterIcon className="mr-2 h-5 w-5" />
              Filter
            </h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Category</h4>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Price Range</h4>
              <Slider
                defaultValue={priceRange}
                max={1000}
                step={10}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>KSH {priceRange[0]}</span>
                <span>KSH {priceRange[1]}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Sort By</h4>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="md:w-3/4">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((item: any) => (
                  <ItemCard 
                    key={item.id} 
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    image={item.image_url || ''}
                    location={item.location || 'Unknown location'}
                    date={new Date(item.created_at).toLocaleDateString()}
                  />
                ))}
                {searchResults.length === 0 && searchPerformed && (
                  <div className="text-center col-span-full">No results found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default SearchPage;
