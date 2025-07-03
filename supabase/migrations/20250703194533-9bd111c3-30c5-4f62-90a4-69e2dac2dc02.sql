-- Add subscription plan field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN plano_assinatura TEXT DEFAULT 'free' CHECK (plano_assinatura IN ('free', 'premium'));

-- Add created_at trigger for user_profiles if not exists
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, plano_assinatura)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();