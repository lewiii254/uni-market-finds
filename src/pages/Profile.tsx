
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ItemCard from '@/components/ItemCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ProfileData = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  phone: string | null;
};

type ItemData = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [myListings, setMyListings] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch user's listings
        const { data: listingsData, error: listingsError } = await supabase
          .from('items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (listingsError) throw listingsError;
        setMyListings(listingsData || []);
      } catch (error: any) {
        console.error('Error loading profile data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      loadProfile();
    }
  }, [user, toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading profile data...</p>
        </div>
      </PageLayout>
    );
  }
  
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const joinedDate = profile?.created_at ? formatDate(profile.created_at) : 'Recently';
  
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Profile</CardTitle>
            <Button variant="outline" onClick={signOut}>Log Out</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-marketplace-purple/10 flex items-center justify-center text-marketplace-purple font-semibold text-xl">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{displayName}</h3>
                  <p className="text-sm text-gray-500">Member since {joinedDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile?.phone || 'Not provided'}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {myListings.map(item => (
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
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't saved any items yet.</p>
              <div className="mt-4">
                <Link to="/">
                  <Button>Browse Listings</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
