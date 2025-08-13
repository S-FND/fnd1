-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('esms-documents', 'esms-documents', false),
  ('irl-files', 'irl-files', false);

-- Create ESMS documents table
CREATE TABLE public.esms_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  portfolio_company_id UUID,
  section_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  title TEXT NOT NULL,
  is_uploaded BOOLEAN NOT NULL DEFAULT false,
  is_not_applicable BOOLEAN NOT NULL DEFAULT false,
  file_name TEXT,
  file_url TEXT,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, document_id)
);

-- Create IRL data table for various form sections
CREATE TABLE public.irl_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  portfolio_company_id UUID,
  section_type TEXT NOT NULL, -- 'company', 'hr', 'business', 'photos', etc.
  field_key TEXT NOT NULL,
  field_value JSONB,
  files JSONB DEFAULT '[]'::jsonb, -- Array of file objects {name, url, size, type}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, section_type, field_key)
);

-- Enable RLS on both tables
ALTER TABLE public.esms_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irl_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ESMS documents
CREATE POLICY "Users can view their own ESMS documents" 
ON public.esms_documents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ESMS documents" 
ON public.esms_documents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ESMS documents" 
ON public.esms_documents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ESMS documents" 
ON public.esms_documents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for IRL data
CREATE POLICY "Users can view their own IRL data" 
ON public.irl_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own IRL data" 
ON public.irl_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own IRL data" 
ON public.irl_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own IRL data" 
ON public.irl_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage policies for ESMS documents
CREATE POLICY "Users can view their own ESMS files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'esms-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own ESMS files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'esms-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own ESMS files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'esms-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ESMS files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'esms-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for IRL files
CREATE POLICY "Users can view their own IRL files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'irl-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own IRL files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'irl-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own IRL files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'irl-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own IRL files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'irl-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_esms_documents_updated_at
BEFORE UPDATE ON public.esms_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_irl_data_updated_at
BEFORE UPDATE ON public.irl_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_esms_documents_user_id ON public.esms_documents(user_id);
CREATE INDEX idx_esms_documents_section_id ON public.esms_documents(section_id);
CREATE INDEX idx_irl_data_user_id ON public.irl_data(user_id);
CREATE INDEX idx_irl_data_section_type ON public.irl_data(section_type);