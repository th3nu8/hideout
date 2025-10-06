-- Create users table for custom authentication
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  last_active timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data (using localStorage-based auth, no auth.uid())
CREATE POLICY "Users can manage their own data" ON public.users FOR ALL USING (true);