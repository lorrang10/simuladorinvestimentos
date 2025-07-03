import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, UserProfile } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

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

  const updateProfile = async (profileData: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>) => {
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
    fetchProfile,
    updateProfile,
  }
}