-- Fix security vulnerabilities in user_profiles table
-- First, delete any rows with NULL user_id (there shouldn't be any in production)
DELETE FROM public.user_profiles WHERE user_id IS NULL;

-- Make user_id NOT NULL to prevent security issues
ALTER TABLE public.user_profiles 
ALTER COLUMN user_id SET NOT NULL;

-- Update RLS policy to be more restrictive
DROP POLICY IF EXISTS "Users can only see their own profile" ON public.user_profiles;

CREATE POLICY "Users can only access their own profile" 
ON public.user_profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix security vulnerabilities in subscribers table  
-- Delete any rows with NULL user_id (cleanup)
DELETE FROM public.subscribers WHERE user_id IS NULL;

-- Make user_id NOT NULL 
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;

-- Drop existing policies and create more restrictive ones
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers; 
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure policies for subscribers
CREATE POLICY "Users can view own subscription" 
ON public.subscribers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update own subscription" 
ON public.subscribers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix security vulnerabilities in investment_simulations table
-- Delete any rows with NULL user_id (cleanup)
DELETE FROM public.investment_simulations WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE public.investment_simulations 
ALTER COLUMN user_id SET NOT NULL;

-- Update RLS policy to be more explicit
DROP POLICY IF EXISTS "Users can only see their own simulations" ON public.investment_simulations;

CREATE POLICY "Users can only access their own simulations" 
ON public.investment_simulations 
FOR ALL 
USING (auth.uid() = user_id);