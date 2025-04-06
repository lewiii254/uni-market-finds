
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ItemCard from '@/components/ItemCard';
import { useToast } from '@/hooks/use-toast';

// Mock user data
const userData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  phone: '+1 (123) 456-7890',
  joined: 'September 2022',
};

// Mock listings data
const myListings = [
  {
    id: '1',
    title: 'MacBook Pro 2019',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'North Dorm',
    date: '2d ago'
  },
  {
    id: '3',
    title: 'Desk Lamp',
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1580021178081-53664b7f8381?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'West Campus',
    date: '1d ago'
  },
];

const savedItems = [
  {
    id: '2',
    title: 'Calculus Textbook',
    price: 45,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Library',
    date: '5h ago'
  },
  {
    id: '7',
    title: 'Wireless Headphones',
    price: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'Student Union',
    date: '4h ago'
  },
];

const Profile = () => {
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Profile</CardTitle>
            <Button variant="outline" onClick={handleLogout}>Log Out</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-marketplace-purple/10 flex items-center justify-center text-marketplace-purple font-semibold text-xl">
                  {userData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{userData.name}</h3>
                  <p className="text-sm text-gray-500">Member since {userData.joined}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Listings Tabs */}
        <Tabs defaultValue="myListings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="myListings">My Listings</TabsTrigger>
            <TabsTrigger value="saved">Saved Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="myListings" className="pt-4">
            {myListings.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {myListings.map(item => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't listed any items yet.</p>
                <div className="mt-4">
                  <Link to="/add-listing">
                    <Button>Add New Listing</Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="pt-4">
            {savedItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {savedItems.map(item => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't saved any items yet.</p>
                <div className="mt-4">
                  <Link to="/">
                    <Button>Browse Listings</Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
