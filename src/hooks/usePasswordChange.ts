import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function usePasswordChange() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true)
    try {
      // Verificar se há um usuário autenticado
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        throw new Error('Usuário não encontrado')
      }

      // Primeiro, verificar se a senha atual está correta
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.user.email!,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('Senha atual incorreta')
      }

      // Usar o método nativo do Supabase para alterar a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        throw updateError
      }

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso",
      })

      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar a senha",
        variant: "destructive",
      })
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    changePassword,
    loading
  }
}