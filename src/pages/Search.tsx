
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
import { motion } from 'framer-motion';

const categories = [
  "All Categories",
  "Electronics", 
  "Textbooks", 
  "Furniture", 
  "Clothing", 
  "School Supplies", 
  "Dorm Essentials"
];

type ItemData = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
  category: string;
};

const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" }
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Get query params or default values
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All Categories';
  const initialMinPrice = parseFloat(searchParams.get('min_price') || '0');
  const initialMaxPrice = parseFloat(searchParams.get('max_price') || '1000');
  const initialSort = searchParams.get('sort') || 'newest';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ItemData[]>([]);
  
  // Fetch items from database
  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);
      try {
        let query = supabase.from('items').select('*');
        
        // Apply filters
        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }
        
        if (selectedCategory !== 'All Categories') {
          query = query.eq('category', selectedCategory.toLowerCase());
        }
        
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        
        // Apply sorting
        switch (sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        console.log("Search results:", data?.length, "items found");
        setItems(data || []);
      } catch (error: any) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error",
          description: "Failed to load items",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchItems();
  }, [searchTerm, selectedCategory, priceRange, sortBy, toast]);
  
  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    
    if (searchTerm) params.q = searchTerm;
    if (selectedCategory !== 'All Categories') params.category = selectedCategory;
    params.min_price = priceRange[0].toString();
    params.max_price = priceRange[1].toString();
    params.sort = sortBy;
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, priceRange, sortBy, setSearchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is already handled by the useEffect
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setPriceRange([0, 1000]);
    setSortBy('newest');
  };
  
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search for items..." 
              className="pl-10 pr-4 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={16} />
            <span>Filters</span>
          </Button>
        </form>
        
        {/* Filters Section */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg border shadow-sm"
          >
            <h3 className="font-medium mb-4">Filter Items</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Price Range</label>
                  <span className="text-sm text-gray-500">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  max={1000}
                  step={5}
                  onValueChange={setPriceRange}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort results by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Results</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{items.length} items found</p>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <FilterIcon size={14} className="mr-1" />
                Filters
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div 
                  key={index} 
                  className="animate-pulse bg-gray-100 rounded-lg aspect-[4/3]"
                ></div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map(item => (
                <ItemCard 
                  key={item.id} 
                  id={item.id}
                  title={item.title} 
                  price={item.price} 
                  image={item.image_url || 'https://via.placeholder.com/300'} 
                  location={item.location}
                  date={new Date(item.created_at).toLocaleDateString()} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No items found matching your search.</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Search;
