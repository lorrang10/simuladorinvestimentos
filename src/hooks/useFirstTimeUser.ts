import { useUserProfile } from './useUserProfile'
import { useInvestmentSimulations } from './useInvestmentSimulations'

export function useFirstTimeUser() {
  const { isProfileComplete, loading: profileLoading } = useUserProfile()
  const { simulations, loading: simulationsLoading } = useInvestmentSimulations()

  const loading = profileLoading || simulationsLoading
  const isFirstTimeUser = isProfileComplete && simulations.length === 0

  return {
    isFirstTimeUser,
    loading
  }
}