import { Crown, Calendar, RefreshCw, Settings, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useSubscription } from "@/hooks/useSubscription"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

export function SubscriptionStatus() {
  const { 
    subscription, 
    loading, 
    isPremium, 
    checkSubscription, 
    cancelSubscription, 
    reactivateSubscription, 
    openCustomerPortal 
  } = useSubscription()
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleRenewal = async (checked: boolean) => {
    setIsToggling(true)
    try {
      if (checked) {
        await reactivateSubscription()
      } else {
        await cancelSubscription()
      }
    } finally {
      setIsToggling(false)
    }
  }

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

  const isRenewing = subscription?.subscribed && !subscription?.cancel_at_period_end
  const isCancelPending = subscription?.cancel_at_period_end

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
          <Button onClick={checkSubscription} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Status
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Plano Premium</CardTitle>
            <Badge variant={isRenewing ? "default" : "secondary"} className={
              isRenewing 
                ? "bg-success text-success-foreground" 
                : "bg-warning text-warning-foreground"
            }>
              {isRenewing ? "Ativo" : "Cancelando"}
            </Badge>
          </div>
        </div>
        
        {subscription?.subscription_tier && (
          <CardDescription>
            {subscription.subscription_tier}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status da renovação */}
        {isCancelPending && (
          <div className="flex items-center gap-2 p-3 bg-warning/10 text-warning-foreground rounded-md border border-warning/20">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Sua assinatura será cancelada em {subscriptionEndDate}</span>
          </div>
        )}
        
        {subscriptionEndDate && !isCancelPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Próxima renovação em {subscriptionEndDate}</span>
          </div>
        )}

        {/* Switch para renovação automática */}
        <div className="flex items-center justify-between p-3 border border-border rounded-md">
          <div className="flex-1">
            <div className="font-medium text-sm">Renovação Automática</div>
            <div className="text-xs text-muted-foreground">
              {isRenewing 
                ? "Sua assinatura será renovada automaticamente" 
                : "Sua assinatura será cancelada no final do período"
              }
            </div>
          </div>
          <Switch
            checked={isRenewing}
            onCheckedChange={handleToggleRenewal}
            disabled={isToggling || loading}
          />
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button 
            onClick={checkSubscription}
            variant="outline" 
            size="sm"
            disabled={isToggling}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Status
          </Button>
          
          <Button 
            onClick={openCustomerPortal}
            variant="secondary" 
            size="sm"
            disabled={isToggling}
          >
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Assinatura
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}