import { Crown, Calendar, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/hooks/useSubscription"
import { Skeleton } from "@/components/ui/skeleton"

export function SubscriptionStatus() {
  const { subscription, loading, isPremium, checkSubscription } = useSubscription()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  const subscriptionEndDate = subscription?.subscription_end 
    ? new Date(subscription.subscription_end).toLocaleDateString('pt-BR')
    : null

  if (!isPremium) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Plano Gratuito</CardTitle>
          </div>
          <CardDescription>
            Faça upgrade para Premium e desbloqueie recursos exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {subscriptionEndDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Renovação automática em {subscriptionEndDate}</span>
            </div>
          )}
          <Button onClick={checkSubscription} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Status
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Plano Premium</CardTitle>
            <Badge className="bg-primary text-primary-foreground">
              Ativo
            </Badge>
          </div>
        </div>
        
        {subscription?.subscription_tier && (
          <CardDescription>
            {subscription.subscription_tier}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {subscriptionEndDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Renovação automática em {subscriptionEndDate}</span>
          </div>
        )}
        
        <Button 
          onClick={checkSubscription}
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar Status
        </Button>
      </CardContent>
    </Card>
  )
}