
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface ItemsTableProps {
  items: Item[];
  isLoading: boolean;
  onItemDeleted: (id: string) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, isLoading, onItemDeleted }) => {
  const { toast } = useToast();

  const handleDeleteItem = async (id: string) => {
    try {
      // First delete any saved items references to prevent foreign key constraints
      const { error: savedItemsError } = await supabase
        .from('saved_items')
        .delete()
        .eq('item_id', id);
      
      if (savedItemsError) {
        console.error('Error deleting saved items:', savedItemsError);
        // Continue with deleting the item even if saved_items deletion fails
      }
      
      // Then delete the item itself
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Item Deleted",
        description: "The listing has been successfully removed",
      });
      
      // Notify parent component about successful deletion
      onItemDeleted(id);
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table>
        <TableCaption>A list of all listed items in the marketplace.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">Loading...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">No items found.</TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="h-16 w-16 object-cover rounded" 
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>KSH {item.price.toLocaleString()}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemsTable;
