-- Drop the existing permissive ALL policy that may allow unauthenticated access
DROP POLICY IF EXISTS "Users can only access their own profile" ON public.user_profiles;

-- Create explicit SELECT policy requiring authentication
CREATE POLICY "Authenticated users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create explicit INSERT policy
CREATE POLICY "Authenticated users can insert own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create explicit UPDATE policy
CREATE POLICY "Authenticated users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create explicit DELETE policy
CREATE POLICY "Authenticated users can delete own profile"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);