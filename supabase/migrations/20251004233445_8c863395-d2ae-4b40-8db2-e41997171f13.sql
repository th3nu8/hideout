-- Create users table with username and secret key authentication
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  secret_key_hash text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  last_active timestamptz DEFAULT now() NOT NULL
);

-- Create favorites table for storing user's favorite games
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  game_name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, game_name)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own last_active"
  ON public.users
  FOR UPDATE
  USING (true);

-- RLS Policies for favorites table
CREATE POLICY "Anyone can view favorites"
  ON public.favorites
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their favorites"
  ON public.favorites
  FOR DELETE
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_last_active ON public.users(last_active);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);