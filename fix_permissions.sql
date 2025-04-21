-- Fix permissions for users to access their own data

-- Drop existing policies
DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_select_admin ON public.users;

-- Create a policy that allows users to read their own data
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (
    auth.uid() = id
  );

-- Create a policy that allows admins to read all users
CREATE POLICY users_select_admin ON public.users
  FOR SELECT USING (
    auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin'
  );

-- Make sure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.users TO authenticated;
GRANT UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.matches TO authenticated;
GRANT SELECT ON public.predictions TO authenticated;

-- Grant additional permissions to anon users for public data
GRANT SELECT ON public.matches TO anon;
GRANT SELECT ON public.predictions TO anon;

-- Fix the admin user's JWT claims
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object('role', 'admin', 'username', 'admin')
WHERE email = 'admin@example.com';

-- Ensure the admin user exists in the public.users table
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
        username = 'admin',
        email = 'admin@example.com',
        updated_at = NOW();
  END IF;
END;
$$;
