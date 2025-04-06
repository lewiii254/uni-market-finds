
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SavedItem = {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
};

export const useSavedItems = () => {
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch saved items when the component mounts
  useEffect(() => {
    if (!user) {
      setSavedItems([]);
      setIsLoading(false);
      return;
    }

    const fetchSavedItems = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('saved_items')
          .select('item_id')
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Extract item IDs from the saved items
        const itemIds = data.map(item => item.item_id);
        setSavedItems(itemIds);
      } catch (error: any) {
        console.error('Error fetching saved items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedItems();
  }, [user]);

  const toggleSavedItem = async (itemId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save items",
        variant: "destructive"
      });
      return;
    }

    try {
      const isSaved = savedItems.includes(itemId);

      if (isSaved) {
        // Remove from saved items
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (error) throw error;

        setSavedItems(savedItems.filter(id => id !== itemId));
        toast({
          title: "Item Removed",
          description: "Item removed from your saved items"
        });
      } else {
        // Add to saved items
        const { error } = await supabase
          .from('saved_items')
          .insert({
            user_id: user.id,
            item_id: itemId
          });

        if (error) throw error;

        setSavedItems([...savedItems, itemId]);
        toast({
          title: "Item Saved",
          description: "Item added to your saved items"
        });
      }
    } catch (error: any) {
      console.error('Error toggling saved item:', error);
      toast({
        title: "Error",
        description: "Failed to update saved items",
        variant: "destructive"
      });
    }
  };

  const isSaved = (itemId: string) => {
    return savedItems.includes(itemId);
  };

  return { savedItems, isLoading, toggleSavedItem, isSaved };
};
