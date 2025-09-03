import { Crown, Calendar, RefreshCw, Settings, AlertTriangle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/hooks/useSubscription"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

const calculateDaysUntilRenewal = (subscriptionEnd: string) => {
  const endDate = new Date(subscriptionEnd)
  const today = new Date()
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getRenewalBadgeVariant = (daysUntilRenewal: number) => {
  if (daysUntilRenewal <= 7) return "destructive"
  if (daysUntilRenewal <= 30) return "secondary"
  return "default"
}

const getPlanPrice = (tier: string) => {
  const prices: Record<string, string> = {
    'Basic': 'R$ 7,99',
    'Premium': 'R$ 29,90',
    'Enterprise': 'R$ 99,90'
  }
  return prices[tier] || 'R$ 29,90'
}

export function SubscriptionStatus() {
  const { subscription, loading, isPremium, checkSubscription, openCustomerPortal } = useSubscription()

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
        <CardContent>
          <Button onClick={checkSubscription} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Status
          </Button>
        </CardContent>
      </Card>
    )
  }

  const subscriptionEndDate = subscription?.subscription_end 
    ? new Date(subscription.subscription_end).toLocaleDateString('pt-BR')
    : null

  const daysUntilRenewal = subscription?.subscription_end 
    ? calculateDaysUntilRenewal(subscription.subscription_end)
    : null

  const planPrice = subscription?.subscription_tier 
    ? getPlanPrice(subscription.subscription_tier)
    : 'R$ 29,90'

  return (
    <div className="space-y-4">
      {/* Alerta de vencimento próximo */}
      {daysUntilRenewal !== null && daysUntilRenewal <= 7 && daysUntilRenewal > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Sua assinatura será renovada automaticamente em {daysUntilRenewal} {daysUntilRenewal === 1 ? 'dia' : 'dias'} por {planPrice}.
          </AlertDescription>
        </Alert>
      )}

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
        
        <CardContent className="space-y-4">
          {/* Informações de renovação detalhadas */}
          {subscriptionEndDate && daysUntilRenewal !== null && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Renovação automática em {subscriptionEndDate}</span>
                </div>
                <Badge 
                  variant={getRenewalBadgeVariant(daysUntilRenewal)}
                  className="text-xs"
                >
                  {daysUntilRenewal > 0 
                    ? `${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'dia' : 'dias'}` 
                    : 'Vencido'
                  }
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Valor da próxima cobrança: <span className="font-medium text-foreground">{planPrice}</span>
              </div>
            </div>
          )}
          
          {/* Botões de ação */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={checkSubscription}
              variant="outline" 
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Status
            </Button>
            
            <Button 
              onClick={openCustomerPortal}
              variant="outline" 
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar Assinatura
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Sua assinatura renovará automaticamente. Cancele a qualquer momento no portal de gerenciamento.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}