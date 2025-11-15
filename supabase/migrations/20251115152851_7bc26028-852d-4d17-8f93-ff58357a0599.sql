-- Create table for storing user's favorite unit conversions
CREATE TABLE IF NOT EXISTS public.unit_conversion_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  from_unit TEXT NOT NULL,
  to_unit TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.unit_conversion_favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view their own unit conversion favorites"
  ON public.unit_conversion_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own favorites
CREATE POLICY "Users can create their own unit conversion favorites"
  ON public.unit_conversion_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own favorites
CREATE POLICY "Users can update their own unit conversion favorites"
  ON public.unit_conversion_favorites
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete their own unit conversion favorites"
  ON public.unit_conversion_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_unit_conversion_favorites_user_id 
  ON public.unit_conversion_favorites(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_unit_conversion_favorites_updated_at
  BEFORE UPDATE ON public.unit_conversion_favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add comment
COMMENT ON TABLE public.unit_conversion_favorites IS 'Stores user favorite unit conversions for quick access in GHG data entry';
