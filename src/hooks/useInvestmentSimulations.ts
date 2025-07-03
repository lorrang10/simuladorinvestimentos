import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, InvestmentSimulation } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useInvestmentSimulations() {
  const [simulations, setSimulations] = useState<InvestmentSimulation[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchSimulations = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('investment_simulations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSimulations(data || [])
    } catch (error) {
      console.error('Erro ao buscar simulações:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as simulações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createSimulation = async (simulationData: Omit<InvestmentSimulation, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('investment_simulations')
        .insert([
          {
            ...simulationData,
            user_id: user.id,
          }
        ])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Simulação salva!",
        description: "Sua simulação foi salva com sucesso",
      })

      fetchSimulations() // Recarrega a lista
      return data
    } catch (error) {
      console.error('Erro ao salvar simulação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a simulação",
        variant: "destructive",
      })
      return null
    }
  }

  const deleteSimulation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investment_simulations')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Simulação excluída",
        description: "A simulação foi excluída com sucesso",
      })

      fetchSimulations() // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir simulação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a simulação",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchSimulations()
    }
  }, [user])

  return {
    simulations,
    loading,
    fetchSimulations,
    createSimulation,
    deleteSimulation,
  }
}