
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Eye, Pencil } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  price: number;
  category: string;
  created_at: string;
  user_id: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
}

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current user is admin
  // For this demo, we'll just check if the email contains 'admin'
  // In a real app, you'd check against a proper role system
  useEffect(() => {
    const checkAdminStatus = () => {
      if (!user) return;
      
      // Simplified admin check - in real app use proper roles
      const isUserAdmin = user.email?.includes('admin');
      setIsAdmin(!!isUserAdmin);
    };
    
    checkAdminStatus();
  }, [user]);

  // Fetch items for admin dashboard
  useEffect(() => {
    if (!isAdmin) return;
    
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
    
    fetchItems();
  }, [isAdmin]);

  // Fetch users for admin dashboard
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchUsers = async () => {
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
    
    fetchUsers();
  }, [isAdmin]);

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Item deleted",
        description: "The item has been successfully removed"
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete the item",
        variant: "destructive"
      });
    }
  };

  // Redirect non-admin users
  if (user && !isAdmin && !isLoading) {
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
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-pulse">Loading listings...</div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-6">No listings found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>KSH {item.price.toLocaleString()}</TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" asChild>
                                  <a href={`/item/${item.id}`} target="_blank" rel="noreferrer">
                                    <Eye className="h-4 w-4" />
                                  </a>
                                </Button>
                                <Button size="icon" variant="ghost">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-6">No users found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-xs">{user.id}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{items.length}</div>
                  <p className="text-xs text-muted-foreground">+0% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">+0% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    KSH {items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">All active listings</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminPage;
