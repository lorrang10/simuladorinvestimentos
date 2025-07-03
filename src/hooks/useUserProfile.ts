import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Tables, TablesInsert } from '@/integrations/supabase/types'

type UserProfile = Tables<'user_profiles'>
type UserProfileInsert = TablesInsert<'user_profiles'>

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const isPremium = profile?.plano_assinatura === 'premium'
  const isProfileComplete = profile && 
    profile.nome_completo && 
    profile.telefone && 
    profile.data_nascimento && 
    profile.perfil_risco && 
    profile.objetivo_investimento

  const fetchProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      setProfile(data || null)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<Omit<UserProfileInsert, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert([
          {
            user_id: user.id,
            ...profileData,
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso",
      })

      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      })
      return null
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  return {
    profile,
    loading,
    isPremium,
    isProfileComplete,
    fetchProfile,
    updateProfile,
  }
}