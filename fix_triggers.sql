-- Drop problematic triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS sync_role_to_jwt ON public.users;
DROP FUNCTION IF EXISTS sync_user_role_to_jwt();

-- Create a simpler function to handle new users without recursion
CREATE OR REPLACE FUNCTION public.handle_new_user_simple() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user into public.users table without updating auth.users
  INSERT INTO public.users (id, username, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_simple();

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create basic policies
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS matches_select_all ON public.matches;
CREATE POLICY matches_select_all ON public.matches
  FOR SELECT USING (true);

DROP POLICY IF EXISTS predictions_select_all ON public.predictions;
CREATE POLICY predictions_select_all ON public.predictions
  FOR SELECT USING (true);

-- Create admin policies without recursion
DROP POLICY IF EXISTS users_select_admin ON public.users;
CREATE POLICY users_select_admin ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
    )
  );

DROP POLICY IF EXISTS users_update_admin ON public.users;
CREATE POLICY users_update_admin ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Fix the admin user
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object('role', 'admin', 'username', 'admin')
WHERE email = 'admin@example.com';

-- Ensure admin user exists in public.users
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@example.com';
  
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.users (id, username, email, role)
    VALUES (
      admin_id,
      'admin',
      'admin@example.com',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        updated_at = NOW();
  END IF;
END;
$$;
