
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Categories from '@/components/Categories';
import ItemCard from '@/components/ItemCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Mock data for now
const featuredItems = [
  {
    id: '1',
    title: 'MacBook Pro 2019',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'North Dorm',
    date: '2d ago'
  },
  {
    id: '2',
    title: 'Calculus Textbook',
    price: 45,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Library',
    date: '5h ago'
  },
  {
    id: '3',
    title: 'Desk Lamp',
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1580021178081-53664b7f8381?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'West Campus',
    date: '1d ago'
  },
  {
    id: '4',
    title: 'Basketball',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1090&q=80',
    location: 'Gym',
    date: '3d ago'
  },
];

const recentItems = [
  {
    id: '5',
    title: 'Mini Fridge',
    price: 75,
    image: 'https://images.unsplash.com/photo-1628236876894-dbbebd0a9395?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'East Dorm',
    date: '2h ago'
  },
  {
    id: '6',
    title: 'Physics Textbooks (Set)',
    price: 65,
    image: 'https://images.unsplash.com/photo-1595617795501-9661aafda72a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'Science Building',
    date: '1h ago'
  },
  {
    id: '7',
    title: 'Wireless Headphones',
    price: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'Student Union',
    date: '4h ago'
  },
  {
    id: '8',
    title: 'Coffee Maker',
    price: 25,
    image: 'https://images.unsplash.com/photo-1606791405792-1004f1d868e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'South Dorm',
    date: '6h ago'
  },
];

const HomePage = () => {
  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Hero section */}
        <div className="text-center py-8">
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
        </div>
        
        {/* Categories section */}
        <Categories />
        
        {/* Featured items section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Featured Items</h2>
            <Link to="/search" className="text-sm text-marketplace-purple hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredItems.map(item => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        </div>
        
        {/* Recent listings section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Recent Listings</h2>
            <Link to="/search" className="text-sm text-marketplace-purple hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentItems.map(item => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
