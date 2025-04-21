-- Complete Supabase setup for Goaltips app

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_select_admin ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
DROP POLICY IF EXISTS users_update_admin ON public.users;
DROP POLICY IF EXISTS matches_select_all ON public.matches;
DROP POLICY IF EXISTS matches_insert_admin ON public.matches;
DROP POLICY IF EXISTS matches_update_admin ON public.matches;
DROP POLICY IF EXISTS matches_delete_admin ON public.matches;
DROP POLICY IF EXISTS predictions_select_all ON public.predictions;
DROP POLICY IF EXISTS predictions_insert_admin ON public.predictions;
DROP POLICY IF EXISTS predictions_update_admin ON public.predictions;
DROP POLICY IF EXISTS predictions_delete_admin ON public.predictions;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.matches (
  id SERIAL PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_date TIMESTAMPTZ NOT NULL,
  league TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.predictions (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  predicted_winner TEXT NOT NULL CHECK (predicted_winner IN ('home', 'away', 'draw')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(match_date);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);

-- Create trigger to automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Store the role in the JWT claims as well as in the users table
  -- This allows us to use auth.jwt() in RLS policies without recursion
  DECLARE
    role_val TEXT;
  BEGIN
    role_val := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
    
    -- Update the user's JWT claims with their role
    UPDATE auth.users
    SET raw_user_meta_data = 
      CASE WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('role', role_val)
      ELSE
        jsonb_set(raw_user_meta_data, '{role}', to_jsonb(role_val))
      END
    WHERE id = NEW.id;
    
    -- Insert or update the user in the users table
    INSERT INTO public.users (id, username, email, role)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), 
      NEW.email,
      role_val
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      updated_at = NOW();
      
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger the function every time a user is updated
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only read their own profile
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Only admins can see all users (using auth.jwt() to avoid recursion)
CREATE POLICY users_select_admin ON public.users
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Users can update their own profile
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Only admins can update any user (using auth.jwt() to avoid recursion)
CREATE POLICY users_update_admin ON public.users
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Matches table policies
-- Anyone can read matches
CREATE POLICY matches_select_all ON public.matches
  FOR SELECT USING (true);

-- Only admins can insert, update, delete matches (using auth.jwt() to avoid recursion)
CREATE POLICY matches_insert_admin ON public.matches
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY matches_update_admin ON public.matches
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY matches_delete_admin ON public.matches
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Predictions table policies
-- Anyone can read predictions
CREATE POLICY predictions_select_all ON public.predictions
  FOR SELECT USING (true);

-- Only admins can insert, update, delete predictions (using auth.jwt() to avoid recursion)
CREATE POLICY predictions_insert_admin ON public.predictions
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY predictions_update_admin ON public.predictions
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY predictions_delete_admin ON public.predictions
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );
