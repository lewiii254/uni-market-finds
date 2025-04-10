
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ItemsTable from '@/components/admin/ItemsTable';
import UsersTable from '@/components/admin/UsersTable';
import StatsOverview from '@/components/admin/StatsOverview';

interface Item {
  id: string;
  title: string;
  price: number;
  category: string;
  created_at: string;
  user_id: string;
  image_url: string | null;
  location: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
}

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current user is admin using the isAdmin function
  const userIsAdmin = isAdmin(user);

  // Fetch items for admin dashboard
  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  };

  // Fetch users for admin dashboard
  const fetchUsers = async () => {
    if (!userIsAdmin) return;
    
    // In a real app, you'd use an admin API to fetch users
    // This is just for demonstration purposes
    const { data, error } = await supabase
      .from('profiles')
      .select('id, created_at');
      
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      // Create mock user data since we can't fetch actual auth users
      const mockUsers = (data || []).map(profile => ({
        id: profile.id,
        email: `user-${profile.id.substring(0, 8)}@example.com`,
        created_at: profile.created_at
      }));
      setUsers(mockUsers);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!userIsAdmin) return;
    
    fetchItems();
    fetchUsers();
  }, [userIsAdmin]);

  const handleItemDeleted = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Redirect non-admin users
  if (user && !userIsAdmin && !isLoading) {
    return <Navigate to="/" />;
  }
  
  // Redirect non-authenticated users
  if (!user && !isLoading) {
    return <Navigate to="/login" />;
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-6">Manage listings, users and settings</p>
        </div>
        
        <Tabs defaultValue="listings">
          <TabsList className="mb-4">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <ItemsTable 
                  items={items} 
                  isLoading={isLoading}
                  onItemDeleted={handleItemDeleted} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UsersTable users={users} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <StatsOverview items={items} usersCount={users.length} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminPage;
