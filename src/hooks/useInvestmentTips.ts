import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface InvestmentTip {
  id: string
  titulo: string
  descricao: string
  categoria: 'investimentos' | 'renda_variavel' | 'renda_fixa' | 'economia'
  icone: string
  ativo: boolean
  created_at: string
}

export function useInvestmentTips() {
  const [tips, setTips] = useState<InvestmentTip[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchRandomTips = async () => {
    setLoading(true)
    try {
      // Buscar 3 dicas aleatórias
      const { data, error } = await supabase
        .from('investment_tips')
        .select('*')
        .eq('ativo', true)
        .order('random()')
        .limit(3)

      if (error) throw error

      setTips(data || [])
      
      // Salvar no localStorage com timestamp
      localStorage.setItem('investment_tips', JSON.stringify({
        tips: data || [],
        lastFetch: Date.now()
      }))
    } catch (error) {
      console.error('Erro ao buscar dicas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as dicas de investimento",
        variant: "destructive",
      })
      // Fallback para dicas padrão
      setTips([
        {
          id: 'fallback-1',
          titulo: 'Diversifique seus investimentos',
          descricao: 'Não coloque todos os ovos na mesma cesta. Distribua seus investimentos entre diferentes classes de ativos.',
          categoria: 'investimentos',
          icone: '🎯',
          ativo: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'fallback-2',
          titulo: 'Crie uma reserva de emergência',
          descricao: 'Mantenha de 3 a 6 meses de gastos em aplicações líquidas antes de investir em produtos de maior prazo.',
          categoria: 'economia',
          icone: '🚨',
          ativo: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'fallback-3',
          titulo: 'Pense no longo prazo',
          descricao: 'Os melhores resultados vêm com o tempo. Tenha paciência e mantenha o foco nos seus objetivos.',
          categoria: 'investimentos',
          icone: '⏰',
          ativo: true,
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const shouldFetchNewTips = () => {
    const stored = localStorage.getItem('investment_tips')
    if (!stored) return true
    
    try {
      const { tips: storedTips, lastFetch } = JSON.parse(stored)
      const hoursSinceLastFetch = (Date.now() - lastFetch) / (1000 * 60 * 60)
      
      // Renovar dicas a cada 24 horas ou se não há dicas armazenadas
      return hoursSinceLastFetch >= 24 || !storedTips?.length
    } catch {
      return true
    }
  }

  useEffect(() => {
    if (shouldFetchNewTips()) {
      fetchRandomTips()
    } else {
      // Carregar dicas do localStorage
      try {
        const stored = localStorage.getItem('investment_tips')
        if (stored) {
          const { tips: storedTips } = JSON.parse(stored)
          setTips(storedTips || [])
        }
      } catch {
        fetchRandomTips()
      }
    }
  }, [])

  return {
    tips,
    loading,
    refetchTips: fetchRandomTips
  }
}