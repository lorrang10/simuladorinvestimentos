
import { Crown, Check, Zap, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/hooks/useSubscription"

interface SubscriptionPlansProps {
  onPlanSelect?: (planType: 'monthly' | 'semiannual' | 'annual') => void
}

export function SubscriptionPlans({ onPlanSelect }: SubscriptionPlansProps) {
  const { createCheckout, loading } = useSubscription()

  const plans = [
    {
      type: 'monthly' as const,
      name: 'Premium Mensal',
      price: 'R$ 9,70',
      billing: '/mês',
      description: 'Perfeito para começar',
      icon: <Calendar className="h-6 w-6" />,
      popular: false,
      discount: null,
    },
    {
      type: 'semiannual' as const,
      name: 'Premium Semestral',
      price: 'R$ 52,70',
      billing: '/semestre',
      description: 'Escolha o plano semestral',
      icon: <Zap className="h-6 w-6" />,
      popular: false,
      discount: '9% OFF',
      originalPrice: 'R$ 58,20',
    },
    {
      type: 'annual' as const,
      name: 'Premium Anual',
      price: 'R$ 78,70',
      billing: '/ano',
      description: 'Máximo desconto',
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      discount: '32% OFF',
      originalPrice: 'R$ 116,40',
    },
  ]

  const features = [
    'Simulações ilimitadas',
    'Salvar simulações',
    'Dashboard completo',
    'Histórico detalhado',
    'Análises avançadas',
    'Relatórios personalizados',
    'Suporte prioritário',
  ]

  const handlePlanSelect = (planType: 'monthly' | 'semiannual' | 'annual') => {
    if (onPlanSelect) {
      onPlanSelect(planType)
    } else {
      createCheckout(planType)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Escolha seu plano Premium</h2>
        <p className="text-lg text-muted-foreground mt-2">
          Desbloqueie todo o potencial do InvestSmart
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.type}
            className={`relative transition-all hover:scale-105 ${
              plan.popular 
                ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}
            
            {plan.discount && (
              <div className="absolute -top-2 -right-2">
                <Badge variant="destructive" className="text-xs">
                  {plan.discount}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-primary">{plan.icon}</div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </div>
              <CardDescription>{plan.description}</CardDescription>
              
              <div className="mt-4">
                {plan.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {plan.originalPrice}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-primary whitespace-nowrap">{plan.price}</span>
                  <span className="text-muted-foreground text-sm sm:text-base">{plan.billing}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button 
                onClick={() => handlePlanSelect(plan.type)}
                disabled={loading}
                className="w-full"
                size="lg"
                variant={plan.popular ? "default" : "outline"}
              >
                <Crown className="h-4 w-4 mr-2" />
                Assinar Agora
              </Button>

              <div className="space-y-2">
                <p className="font-medium text-sm">Recursos inclusos:</p>
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Todos os planos incluem garantia de 7 dias. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  )
}
