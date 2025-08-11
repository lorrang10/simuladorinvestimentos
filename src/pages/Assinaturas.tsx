import { useState, useRef } from "react"
import { Crown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans"
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus"
import { useSubscription } from "@/hooks/useSubscription"
import { useNavigate } from "react-router-dom"

export default function Assinaturas() {
  const [showPlans, setShowPlans] = useState(false)
  const { isPremium } = useSubscription()
  const navigate = useNavigate()
  const plansRef = useRef<HTMLDivElement>(null)

  const handleShowPlans = () => {
    setShowPlans(true)
    setTimeout(() => {
      plansRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/simular-investimento')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Crown className="h-8 w-8 text-primary" />
              Assinaturas
            </h1>
            <p className="text-muted-foreground">
              Gerencie sua assinatura e acesse recursos premium
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Status da Assinatura */}
          <SubscriptionStatus />

          {/* Recursos Premium */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos Premium</CardTitle>
              <CardDescription>
                Veja todos os benefícios inclusos na assinatura Premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Simulações Ilimitadas",
                    description: "Crie quantas simulações quiser sem limitações"
                  },
                  {
                    title: "Salvar Simulações",
                    description: "Salve e organize suas simulações favoritas"
                  },
                  {
                    title: "Dashboard Completo",
                    description: "Acesse métricas avançadas e insights detalhados"
                  },
                  {
                    title: "Histórico Detalhado",
                    description: "Visualize todo seu histórico de investimentos"
                  },
                  {
                    title: "Análises Avançadas",
                    description: "Relatórios personalizados e comparações"
                  },
                  {
                    title: "Suporte Prioritário",
                    description: "Atendimento especializado quando precisar"
                  }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border bg-card"
                  >
                    <h3 className="font-medium mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
              
              {!isPremium && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleShowPlans}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Ver Planos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Planos de Assinatura */}
          {showPlans && (
            <div ref={plansRef}>
              <Card>
                <CardHeader>
                  <CardTitle>Planos de Assinatura</CardTitle>
                  <CardDescription>
                    Escolha o plano que melhor se adapta às suas necessidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SubscriptionPlans />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}