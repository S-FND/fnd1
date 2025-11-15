import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UnitConversionFavorite {
  id: string;
  user_id: string;
  name: string;
  from_unit: string;
  to_unit: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useUnitConversionFavorites = () => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<UnitConversionFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('unit_conversion_favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error Loading Favorites",
        description: error.message || "Failed to load saved conversions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (
    name: string,
    fromUnit: string,
    toUnit: string,
    description?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('unit_conversion_favorites')
        .insert({
          user_id: user.id,
          name,
          from_unit: fromUnit,
          to_unit: toUnit,
          description,
        })
        .select()
        .single();

      if (error) throw error;

      setFavorites((prev) => [data, ...prev]);
      toast({
        title: "Favorite Saved",
        description: `"${name}" has been added to your favorites`,
      });

      return data;
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Error Saving Favorite",
        description: error.message || "Failed to save conversion",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('unit_conversion_favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      toast({
        title: "Favorite Removed",
        description: "Conversion has been removed from favorites",
      });
    } catch (error: any) {
      console.error('Error deleting favorite:', error);
      toast({
        title: "Error Removing Favorite",
        description: error.message || "Failed to remove conversion",
        variant: "destructive",
      });
    }
  };

  const updateFavorite = async (
    id: string,
    updates: Partial<Pick<UnitConversionFavorite, 'name' | 'description'>>
  ) => {
    try {
      const { data, error } = await supabase
        .from('unit_conversion_favorites')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFavorites((prev) =>
        prev.map((fav) => (fav.id === id ? data : fav))
      );

      toast({
        title: "Favorite Updated",
        description: "Conversion has been updated",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error Updating Favorite",
        description: error.message || "Failed to update conversion",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    addFavorite,
    deleteFavorite,
    updateFavorite,
    refetch: fetchFavorites,
  };
};
