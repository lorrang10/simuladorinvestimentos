-- Improve database function security by setting proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, plano_assinatura)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$function$;