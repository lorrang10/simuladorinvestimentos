-- Add missing DELETE policy for subscribers table
CREATE POLICY "Users can delete own subscription" ON public.subscribers
FOR DELETE 
USING (auth.uid() = user_id);