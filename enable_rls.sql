-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Make sure the policies are correctly applied
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Create a policy to allow users to update their own profile
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create a policy to allow anyone to read matches
DROP POLICY IF EXISTS matches_select_all ON public.matches;
CREATE POLICY matches_select_all ON public.matches
  FOR SELECT USING (true);

-- Create a policy to allow anyone to read predictions
DROP POLICY IF EXISTS predictions_select_all ON public.predictions;
CREATE POLICY predictions_select_all ON public.predictions
  FOR SELECT USING (true);
