
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ItemCard from '@/components/ItemCard';
import { SearchIcon, FilterIcon } from 'lucide-react';

const categories = [
  "All Categories",
  "Electronics", 
  "Textbooks", 
  "Furniture", 
  "Clothing", 
  "School Supplies", 
  "Dorm Essentials"
];

// Mock data
const allItems = [
  {
    id: '1',
    title: 'MacBook Pro 2019',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'North Dorm',
    date: '2d ago',
    category: 'Electronics'
  },
  {
    id: '2',
    title: 'Calculus Textbook',
    price: 45,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Library',
    date: '5h ago',
    category: 'Textbooks'
  },
  {
    id: '3',
    title: 'Desk Lamp',
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1580021178081-53664b7f8381?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'West Campus',
    date: '1d ago',
    category: 'Dorm Essentials'
  },
  {
    id: '4',
    title: 'Basketball',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1090&q=80',
    location: 'Gym',
    date: '3d ago',
    category: 'School Supplies'
  },
  {
    id: '5',
    title: 'Mini Fridge',
    price: 75,
    image: 'https://images.unsplash.com/photo-1628236876894-dbbebd0a9395?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'East Dorm',
    date: '2h ago',
    category: 'Electronics'
  },
  {
    id: '6',
    title: 'Physics Textbooks (Set)',
    price: 65,
    image: 'https://images.unsplash.com/photo-1595617795501-9661aafda72a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'Science Building',
    date: '1h ago',
    category: 'Textbooks'
  },
  {
    id: '7',
    title: 'Wireless Headphones',
    price: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'Student Union',
    date: '4h ago',
    category: 'Electronics'
  },
  {
    id: '8',
    title: 'Coffee Maker',
    price: 25,
    image: 'https://images.unsplash.com/photo-1606791405792-1004f1d868e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'South Dorm',
    date: '6h ago',
    category: 'Dorm Essentials'
  },
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter items based on search, category, and price
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
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
        </div>
        
        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
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
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={5}
                  onValueChange={setPriceRange}
                />
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All Categories');
                    setPriceRange([0, 1000]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="text-sm text-gray-500">{filteredItems.length} items found</p>
          </div>
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <ItemCard key={item.id} {...item} />
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
