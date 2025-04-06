
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const categories = [
  "Electronics", 
  "Textbooks", 
  "Furniture", 
  "Clothing", 
  "School Supplies", 
  "Dorm Essentials"
];

const ListingForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Listing Created",
        description: "Your item has been listed successfully.",
      });
      // Reset form or redirect
    }, 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Listing</CardTitle>
          <CardDescription>Post your item for sale on the marketplace</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Item Title</Label>
              <Input id="title" placeholder="e.g. iPhone 13 Pro Max - Excellent Condition" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your item, include details about condition, age, etc." 
                rows={4}
                required
              />
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location on Campus</Label>
              <Input id="location" placeholder="e.g. North Dorm, Engineering Building" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" placeholder="your.email@university.edu" />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (123) 456-7890" />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <div className="mt-2 flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative aspect-video w-full max-h-56 overflow-hidden rounded-lg">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="object-cover w-full h-full" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImagePreview(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        {/* Simple upload icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-marketplace-purple">Click to upload</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-marketplace-purple hover:bg-marketplace-darkPurple"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Listing...' : 'Create Listing'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ListingForm;
