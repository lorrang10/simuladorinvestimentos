import { useSubscription } from '@/hooks/useSubscription'
import { useUserProfile } from '@/hooks/useUserProfile'

export function useAdVisibility() {
  const { isPremium: isStripePremium } = useSubscription()
  const { isPremium: isProfilePremium } = useUserProfile()

  // Usuário é premium se tem assinatura Stripe OU se o perfil indica premium
  const isPremium = isStripePremium || isProfilePremium
  
  // Anúncios são visíveis apenas para usuários não-premium
  const shouldShowAds = !isPremium

  return {
    shouldShowAds,
    isPremium,
    hideReason: isPremium ? 'premium_user' : null
  }
}