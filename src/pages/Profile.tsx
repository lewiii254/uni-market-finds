
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ItemCard from '@/components/ItemCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSavedItems } from '@/hooks/useSavedItems';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, MapPin, Package, BookmarkIcon, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ProfileData = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  phone: string | null;
  created_at?: string;
};

type ItemData = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
};

const profileSchema = z.object({
  full_name: z.string().min(2, "Name is required").max(50),
  phone: z.string().optional(),
  university: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { savedItems } = useSavedItems();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [myListings, setMyListings] = useState<ItemData[]>([]);
  const [savedListings, setSavedListings] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      university: profile?.university || "",
    },
  });

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
        
        // Set form values
        form.reset({
          full_name: profileData?.full_name || "",
          phone: profileData?.phone || "",
          university: profileData?.university || "",
        });
        
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

  // Fetch saved items when savedItems ids change
  useEffect(() => {
    async function fetchSavedListings() {
      if (!savedItems.length) {
        setSavedListings([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .in('id', savedItems);
        
        if (error) throw error;
        setSavedListings(data || []);
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      }
    }

    fetchSavedListings();
  }, [savedItems]);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          phone: values.phone,
          university: values.university,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile!,
        full_name: values.full_name,
        phone: values.phone,
        university: values.university,
      });
      
      setIsEditing(false);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-marketplace-purple/20 rounded-full"></div>
            <div className="h-4 bg-marketplace-purple/20 rounded w-48"></div>
            <div className="h-3 bg-marketplace-purple/10 rounded w-36"></div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const joinedDate = profile?.created_at ? formatDate(profile.created_at) : 'Recently';
  const initialLetter = displayName.charAt(0).toUpperCase();
  
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-marketplace-purple/20 to-marketplace-purple/5 rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={displayName} />
              ) : (
                <AvatarFallback className="bg-marketplace-purple text-white text-xl">
                  {initialLetter}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-marketplace-purple" />
                  <span>{user.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-marketplace-purple" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-marketplace-purple" />
                  <span>Joined {joinedDate}</span>
                </div>
                {profile?.university && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-marketplace-purple" />
                    <span>{profile.university}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
              
              <Button variant="outline" onClick={signOut} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                Log Out
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Edit Profile Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Edit Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number (optional)" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University/Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your university or location (optional)" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="w-full sm:w-auto">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Listings Tabs */}
        <Tabs defaultValue="myListings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="myListings" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Listings
              {myListings.length > 0 && (
                <span className="bg-marketplace-purple text-white text-xs px-2 py-0.5 rounded-full">
                  {myListings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4" />
              Saved Items
              {savedListings.length > 0 && (
                <span className="bg-marketplace-purple text-white text-xs px-2 py-0.5 rounded-full">
                  {savedListings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="myListings" className="pt-0">
              {myListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {myListings.map(item => (
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
                    <h3 className="text-xl font-medium mb-2">No Items Listed Yet</h3>
                    <p className="text-gray-500 mb-6">Start selling by adding your first item to the marketplace.</p>
                    <Link to="/add-listing">
                      <Button size="lg">
                        Add New Listing
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="saved" className="pt-0">
              {savedListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {savedListings.map(item => (
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
                    <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Saved Items</h3>
                    <p className="text-gray-500 mb-6">Items you save will appear here for easy access.</p>
                    <Link to="/">
                      <Button size="lg">
                        Browse Listings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
