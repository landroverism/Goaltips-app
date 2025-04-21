-- Fix RLS policies to handle admin access properly

-- Drop existing policies
DROP POLICY IF EXISTS users_select_admin ON public.users;
DROP POLICY IF EXISTS users_update_admin ON public.users;
DROP POLICY IF EXISTS matches_insert_admin ON public.matches;
DROP POLICY IF EXISTS matches_update_admin ON public.matches;
DROP POLICY IF EXISTS matches_delete_admin ON public.matches;
DROP POLICY IF EXISTS predictions_insert_admin ON public.predictions;
DROP POLICY IF EXISTS predictions_update_admin ON public.predictions;
DROP POLICY IF EXISTS predictions_delete_admin ON public.predictions;

-- Create more flexible admin policies that check both JWT and database
-- Users table admin policies
CREATE POLICY users_select_admin ON public.users
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY users_update_admin ON public.users
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Matches table admin policies
CREATE POLICY matches_insert_admin ON public.matches
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY matches_update_admin ON public.matches
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY matches_delete_admin ON public.matches
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Predictions table admin policies
CREATE POLICY predictions_insert_admin ON public.predictions
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY predictions_update_admin ON public.predictions
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY predictions_delete_admin ON public.predictions
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Create a function to sync user metadata with JWT claims
CREATE OR REPLACE FUNCTION sync_user_role_to_jwt()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the JWT claims with the role from the users table
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(NEW.role)
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to sync role changes to JWT
DROP TRIGGER IF EXISTS sync_role_to_jwt ON public.users;
CREATE TRIGGER sync_role_to_jwt
  AFTER UPDATE OF role ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role_to_jwt();
