-- Criar enum para categorias das dicas
CREATE TYPE public.tip_category AS ENUM ('investimentos', 'renda_variavel', 'renda_fixa', 'economia');

-- Criar tabela investment_tips
CREATE TABLE public.investment_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria tip_category NOT NULL,
  icone TEXT NOT NULL DEFAULT '💡',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.investment_tips ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read active tips
CREATE POLICY "Users can view active tips" 
ON public.investment_tips 
FOR SELECT 
USING (ativo = true);

-- Insert dicas variadas
INSERT INTO public.investment_tips (titulo, descricao, categoria, icone) VALUES
-- Investimentos gerais
('Diversifique seus investimentos', 'Não coloque todos os ovos na mesma cesta. Distribua seus investimentos entre diferentes classes de ativos para reduzir riscos.', 'investimentos', '🎯'),
('Invista regularmente', 'O segredo do sucesso é a constância. Invista um valor fixo mensalmente, independente das oscilações do mercado.', 'investimentos', '📅'),
('Tenha objetivos claros', 'Defina metas específicas para seus investimentos: aposentadoria, casa própria, viagem. Isso ajuda a escolher os produtos certos.', 'investimentos', '🎯'),
('Estude antes de investir', 'Conhecimento é poder. Dedique tempo para entender cada investimento antes de aplicar seu dinheiro.', 'investimentos', '📚'),
('Pense no longo prazo', 'Os melhores resultados vêm com o tempo. Tenha paciência e mantenha o foco nos seus objetivos de longo prazo.', 'investimentos', '⏰'),

-- Renda variável
('Foque em empresas sólidas', 'Ao investir em ações, prefira empresas com boa governança, histórico consistente e perspectivas futuras positivas.', 'renda_variavel', '🏢'),
('ETFs para diversificação', 'ETFs são uma forma prática de diversificar em renda variável, seguindo índices com menor custo e esforço.', 'renda_variavel', '📊'),
('Analise os fundamentos', 'Não invista apenas na "dica quente". Analise receita, lucro, dívidas e perspectivas da empresa.', 'renda_variavel', '🔍'),
('Reinvista os dividendos', 'Os dividendos recebidos podem ser reinvestidos para acelerar o crescimento do seu patrimônio através dos juros compostos.', 'renda_variavel', '💰'),
('Volatilidade é normal', 'Oscilações fazem parte da renda variável. Não se desespere com quedas temporárias se você tem objetivos de longo prazo.', 'renda_variavel', '📈'),

-- Renda fixa
('Tesouro Direto é seguro', 'Os títulos do Tesouro são garantidos pelo governo federal e são uma excelente opção para quem busca segurança.', 'renda_fixa', '🏛️'),
('CDB vs Poupança', 'CDBs de bancos grandes geralmente rendem mais que a poupança com a mesma segurança do FGC.', 'renda_fixa', '🏦'),
('Atenção à liquidez', 'Considere quando precisará do dinheiro. Alguns investimentos de renda fixa têm carência ou penalidades para resgate antecipado.', 'renda_fixa', '💧'),
('Prefixado vs Pós-fixado', 'Títulos prefixados são bons quando você acredita que os juros vão cair. Pós-fixados protegem da alta dos juros.', 'renda_fixa', '⚖️'),
('LCI e LCA são isentas', 'Letras de Crédito Imobiliário e do Agronegócio são isentas de IR para pessoa física, aumentando sua rentabilidade líquida.', 'renda_fixa', '🏠'),

-- Economia
('Crie uma reserva de emergência', 'Mantenha de 3 a 6 meses de gastos em aplicações líquidas antes de investir em produtos de maior prazo.', 'economia', '🚨'),
('Controle seus gastos', 'Use aplicativos ou planilhas para acompanhar onde seu dinheiro está indo. Conhecimento é o primeiro passo para economizar.', 'economia', '📱'),
('Negocie suas contas', 'Renegocie planos de telefone, internet e seguros anualmente. Pequenas economias fazem diferença no longo prazo.', 'economia', '💬'),
('Evite o cartão rotativo', 'O rotativo do cartão tem juros altíssimos. Se usou, quite o quanto antes ou negocie o parcelamento.', 'economia', '💳'),
('Compre à vista quando possível', 'Muitas vezes o desconto à vista compensa mais do que manter o dinheiro investido. Faça as contas!', 'economia', '💵'),
('Automatize suas economias', 'Configure transferências automáticas para investimentos. Assim você economiza sem sentir no orçamento.', 'economia', '🤖'),
('Regra 50-30-20', 'Destine 50% da renda para necessidades, 30% para desejos e 20% para poupança e investimentos.', 'economia', '📊'),
('Evite compras por impulso', 'Antes de comprar algo caro, espere 24 horas. Muitas vezes você perceberá que não precisa tanto assim.', 'economia', '🛍️'),
('Compare preços online', 'Use comparadores de preço e cashback. Pequenas economias se acumulam ao longo do ano.', 'economia', '🔍'),
('Invista em você mesmo', 'Cursos e capacitação são investimentos que podem aumentar sua renda no longo prazo.', 'economia', '🎓');