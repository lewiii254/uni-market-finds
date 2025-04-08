
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ItemCard from '@/components/ItemCard';
import { Package } from 'lucide-react';

interface ItemData {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
}

interface ListingsTabProps {
  listings: ItemData[];
}

const ListingsTab = ({ listings }: ListingsTabProps) => {
  return (
    <>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hover:-translate-y-1 transition-transform duration-200"
            >
              <ItemCard 
                key={item.id} 
                id={item.id}
                title={item.title} 
                price={item.price} 
                image={item.image_url || 'https://via.placeholder.com/300'} 
                location={item.location}
                date={new Date(item.created_at).toLocaleDateString()} 
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-gray-50">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Items Listed Yet 📦</h3>
            <p className="text-gray-500 mb-6">Start selling by adding your first item to the marketplace!</p>
            <Link to="/add-listing">
              <Button size="lg" className="bg-marketplace-purple hover:bg-marketplace-darkPurple">
                🚀 Add New Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ListingsTab;
