
-- Enum para categoria de dicas
CREATE TYPE public.tip_category AS ENUM ('investimentos','renda_variavel','renda_fixa','economia');

-- Função utilitária para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ user_profiles ============
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  nome_completo TEXT,
  telefone TEXT,
  data_nascimento DATE,
  perfil_risco TEXT,
  objetivo_investimento TEXT,
  plano_assinatura TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own profile" ON public.user_profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ investment_simulations ============
CREATE TABLE public.investment_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  valor_inicial NUMERIC NOT NULL,
  valor_mensal NUMERIC,
  periodo_anos NUMERIC NOT NULL,
  taxa_juros NUMERIC NOT NULL,
  tipo_indexador TEXT,
  percentual_manual NUMERIC,
  valor_final NUMERIC NOT NULL,
  rendimento_total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investment_simulations TO authenticated;
GRANT ALL ON public.investment_simulations TO service_role;
ALTER TABLE public.investment_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own simulations" ON public.investment_simulations
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ investment_tips ============
CREATE TABLE public.investment_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria public.tip_category NOT NULL,
  icone TEXT NOT NULL DEFAULT 'lightbulb',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.investment_tips TO anon, authenticated;
GRANT ALL ON public.investment_tips TO service_role;
ALTER TABLE public.investment_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active tips" ON public.investment_tips
  FOR SELECT TO anon, authenticated
  USING (ativo = true);

-- ============ subscribers ============
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own subscription" ON public.subscribers
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own subscription" ON public.subscribers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own subscription" ON public.subscribers
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Trigger para criar profile automaticamente ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, plano_assinatura)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ Seed: dicas iniciais ============
INSERT INTO public.investment_tips (titulo, descricao, categoria, icone) VALUES
  ('Diversifique sua carteira', 'Não coloque todos os ovos na mesma cesta. Distribua seus investimentos entre diferentes ativos.', 'investimentos', 'pie-chart'),
  ('Comece pela reserva de emergência', 'Antes de investir em renda variável, tenha de 6 a 12 meses de despesas em renda fixa de alta liquidez.', 'renda_fixa', 'shield'),
  ('Invista a longo prazo', 'O tempo é seu maior aliado nos investimentos por causa dos juros compostos.', 'investimentos', 'trending-up'),
  ('Estude antes de investir em ações', 'Renda variável exige conhecimento. Estude empresas, setores e indicadores antes de comprar.', 'renda_variavel', 'book-open'),
  ('Controle seus gastos', 'Investir começa por gastar menos do que ganha. Faça um orçamento mensal.', 'economia', 'wallet');
