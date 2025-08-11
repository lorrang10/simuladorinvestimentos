import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { AuthForm } from "./AuthForm"
import { PersonalDataForm } from "./PersonalDataForm"
import { Skeleton } from "@/components/ui/skeleton"
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans"

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
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Funcionalidade Premium
            </h1>
            <p className="text-muted-foreground">
              Esta funcionalidade está disponível apenas para usuários Premium.
            </p>
          </div>
          <SubscriptionPlans />
        </div>
      </div>
    )
  }

  return children as React.ReactElement
}