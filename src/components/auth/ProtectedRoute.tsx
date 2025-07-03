import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { AuthForm } from "./AuthForm"
import { PersonalDataForm } from "./PersonalDataForm"
import { Skeleton } from "@/components/ui/skeleton"
import { PremiumFeatureLock } from "@/components/premium/PremiumBanner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiresPremium?: boolean
}

export function ProtectedRoute({ children, requiresPremium = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { isPremium, isProfileComplete, loading: profileLoading, fetchProfile } = useUserProfile()

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (user && !isProfileComplete) {
    return <PersonalDataForm onComplete={fetchProfile} />
  }

  if (requiresPremium && !isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <PremiumFeatureLock feature="Esta página" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}