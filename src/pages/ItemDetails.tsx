
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';

// Mock data - in a real app, you'd fetch this based on the ID
const itemDetails = {
  id: '1',
  title: 'MacBook Pro 2019',
  price: 899.99,
  description: 'MacBook Pro 2019 model in excellent condition. 16GB RAM, 512GB SSD, Intel i7 processor. Comes with charger and original box. Perfect for college students who need a reliable laptop for coursework and programming. Battery health is at 89%.',
  images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
  location: 'North Dorm, Room 304',
  date: '2 days ago',
  seller: {
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (123) 456-7890'
  },
  category: 'Electronics'
};

const ItemDetails = () => {
  const { id } = useParams();
  
  // In a real app, you'd fetch the item data based on the ID
  // For now, we'll use our mock data
  
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl border">
              <img 
                src={itemDetails.images[0]} 
                alt={itemDetails.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{itemDetails.title}</h1>
              <p className="text-3xl font-semibold text-marketplace-purple mt-2">${itemDetails.price.toFixed(2)}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <span>{itemDetails.location}</span>
                <span>•</span>
                <span>Listed {itemDetails.date}</span>
              </div>
            </div>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{itemDetails.description}</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-3">Contact Seller</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-medium">{itemDetails.seller.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={`mailto:${itemDetails.seller.email}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">
                      Email Seller
                    </Button>
                  </a>
                  <a 
                    href={`https://wa.me/${itemDetails.seller.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ItemDetails;
