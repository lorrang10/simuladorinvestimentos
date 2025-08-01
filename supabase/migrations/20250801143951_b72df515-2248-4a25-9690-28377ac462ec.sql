-- Adicionar campos para percentual manual na tabela investment_simulations
ALTER TABLE public.investment_simulations 
ADD COLUMN percentual_manual numeric,
ADD COLUMN tipo_indexador text CHECK (tipo_indexador IN ('CDI', 'SELIC', 'IPCA', 'FIXO'));

-- Adicionar comentários para documentar os novos campos
COMMENT ON COLUMN public.investment_simulations.percentual_manual IS 'Percentual manual inserido pelo usuário (ex: 120 para 120% do CDI)';
COMMENT ON COLUMN public.investment_simulations.tipo_indexador IS 'Tipo de indexador usado como base (CDI, SELIC, IPCA, FIXO)';