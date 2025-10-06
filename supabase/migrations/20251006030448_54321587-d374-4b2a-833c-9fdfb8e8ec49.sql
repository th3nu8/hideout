-- Fix RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix RLS policy for global_chat table  
DROP POLICY IF EXISTS "Everyone can view chat messages" ON public.global_chat;
CREATE POLICY "Authenticated users can view chat messages"
ON public.global_chat
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Add index for better chat performance
CREATE INDEX IF NOT EXISTS idx_global_chat_created_at ON public.global_chat(created_at DESC);

-- Create browser_data table for syncing browser data with user accounts
CREATE TABLE IF NOT EXISTS public.browser_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_type text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.browser_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own browser data" ON public.browser_data;
CREATE POLICY "Users can view their own browser data"
ON public.browser_data
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own browser data" ON public.browser_data;
CREATE POLICY "Users can insert their own browser data"
ON public.browser_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own browser data" ON public.browser_data;
CREATE POLICY "Users can update their own browser data"
ON public.browser_data
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own browser data" ON public.browser_data;
CREATE POLICY "Users can delete their own browser data"
ON public.browser_data
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for browser_data updated_at
CREATE OR REPLACE FUNCTION update_browser_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_browser_data_timestamp ON public.browser_data;
CREATE TRIGGER update_browser_data_timestamp
BEFORE UPDATE ON public.browser_data
FOR EACH ROW
EXECUTE FUNCTION update_browser_data_updated_at();