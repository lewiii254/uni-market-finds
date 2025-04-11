
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

type PickupPoint = {
  id: string;
  name: string;
  location: string;
  description: string;
  coordinates?: string;
  campus?: string;
};

const PickupPoints: React.FC<{ itemLocation?: string }> = ({ itemLocation }) => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  
  // Get user's geolocation if they allow it
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position),
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);
  
  // Query to fetch safe pickup points
  const { data: pickupPoints, isLoading } = useQuery({
    queryKey: ['pickupPoints', itemLocation],
    queryFn: async () => {
      try {
        // Get user's university if logged in
        let campus = '';
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('university')
            .eq('id', user.id)
            .single();
          
          if (profile?.university) {
            campus = profile.university;
          }
        }
        
        // Query pickup points, prioritizing those matching the item location or user's campus
        let query = supabase.from('pickup_points').select('*');
        
        // Filter by campus/location if available
        if (campus) {
          query = query.or(`campus.ilike.%${campus}%,location.ilike.%${campus}%`);
        } else if (itemLocation) {
          query = query.or(`location.ilike.%${itemLocation}%`);
        }
        
        const { data, error } = await query.limit(3);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching pickup points:", error);
        return [];
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-medium mb-3 flex items-center">
            <MapPin className="mr-2 h-4 w-4" /> 
            Safe Pickup Points
          </h3>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="mb-3">
              <Skeleton className="h-5 w-4/5 mb-1" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  // If no pickup points available
  if (!pickupPoints || pickupPoints.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-medium mb-3 flex items-center">
            <MapPin className="mr-2 h-4 w-4" /> 
            Safe Pickup Points
          </h3>
          <p className="text-sm text-gray-500">
            No designated safe pickup points found for this location.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Function to open in Google Maps
  const openInMaps = (point: PickupPoint) => {
    // First try using coordinates if available
    if (point.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${point.coordinates}`, '_blank');
    } else {
      // Fall back to name + location
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${point.name}, ${point.location}`)}`, '_blank');
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="font-medium mb-3 flex items-center">
          <MapPin className="mr-2 h-4 w-4" /> 
          Safe Pickup Points
        </h3>
        <div className="space-y-3">
          {pickupPoints.map((point) => (
            <div key={point.id} className="border-b border-gray-100 pb-2 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{point.name}</p>
                  <p className="text-xs text-gray-500">{point.location}</p>
                  {point.description && (
                    <p className="text-xs text-gray-500 mt-1">{point.description}</p>
                  )}
                </div>
                <button 
                  onClick={() => openInMaps(point)}
                  className="text-marketplace-purple hover:text-marketplace-purple/80 p-1"
                  title="Open in Google Maps"
                >
                  <Navigation size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PickupPoints;
