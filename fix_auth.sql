-- Fix authentication issues

-- Create a function to ensure proper user setup
CREATE OR REPLACE FUNCTION public.ensure_user_in_users_table()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user exists in public.users
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) THEN
    -- Insert the user if they don't exist
    INSERT INTO public.users (id, username, email, role)
    VALUES (
      auth.uid(),
      COALESCE(current_setting('request.jwt.claims', true)::json->>'preferred_username', split_part(current_setting('request.jwt.claims', true)::json->>'email', '@', 1)),
      current_setting('request.jwt.claims', true)::json->>'email',
      COALESCE(current_setting('request.jwt.claims', true)::json->>'role', 'user')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to ensure users exist in the users table when they authenticate
DROP TRIGGER IF EXISTS ensure_user_exists ON auth.users;
CREATE TRIGGER ensure_user_exists
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_in_users_table();

-- Create a function to handle user login
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's last login time
  UPDATE public.users
  SET updated_at = NOW()
  WHERE id = auth.uid();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for user login
DROP TRIGGER IF EXISTS on_user_login ON auth.sessions;
CREATE TRIGGER on_user_login
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_login();

-- Fix the admin user if needed
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@example.com';
  
  IF admin_id IS NOT NULL THEN
    -- Ensure admin user exists in public.users table
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
    
    -- Update the admin user's metadata
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_build_object('role', 'admin', 'username', 'admin')
    WHERE id = admin_id;
  END IF;
END;
$$;
