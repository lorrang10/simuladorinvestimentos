import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useUserProfile } from '@/hooks/useUserProfile'

interface SubscriptionData {
  subscribed: boolean
  subscription_tier?: string
  subscription_end?: string
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(false)
  const { user, session } = useAuth()
  const { profile } = useUserProfile()
  const { toast } = useToast()

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscription({ subscribed: false })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) throw error

      setSubscription(data)
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error)
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status da assinatura",
        variant: "destructive",
      })
      setSubscription({ subscribed: false })
    } finally {
      setLoading(false)
    }
  }

  const createCheckout = async (planType: 'monthly' | 'semiannual' | 'annual') => {
    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para assinar",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) throw error

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank')
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a sessão de pagamento",
        variant: "destructive",
      })
    }
  }

  const openCustomerPortal = async () => {
    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerenciar a assinatura",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) throw error

      // Open customer portal in a new tab
      window.open(data.url, '_blank')
    } catch (error) {
      console.error('Erro ao abrir portal do cliente:', error)
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de gerenciamento",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      checkSubscription()
    }
  }, [user])

  // Check both Stripe subscription and user profile for premium status
  const isPremiumFromStripe = subscription?.subscribed || false
  const isPremiumFromProfile = profile?.plano_assinatura === 'premium'
  const isPremium = isPremiumFromStripe || isPremiumFromProfile

  return {
    subscription,
    loading,
    isPremium,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  }
}