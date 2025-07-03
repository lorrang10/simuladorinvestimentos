import { BarChart, TrendingUp, DollarSign, Target } from "lucide-react"
import { Header } from "@/components/header"
import { MetricCard } from "@/components/metric-card"
import { SimulationChart } from "@/components/simulation-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useInvestmentSimulations } from "@/hooks/useInvestmentSimulations"
import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
  const { user } = useAuth()
  const { simulations, loading } = useInvestmentSimulations()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getTotalValue = () => {
    return simulations.reduce((total, sim) => total + sim.valor_final, 0)
  }

  const getTotalInvested = () => {
    return simulations.reduce((total, sim) => total + sim.valor_inicial + (sim.valor_mensal * 12 * sim.periodo_anos), 0)
  }

  const getAverageReturn = () => {
    if (simulations.length === 0) return 0
    const totalReturn = simulations.reduce((total, sim) => total + sim.taxa_juros, 0)
    return (totalReturn / simulations.length) * 100
  }

  const recentSimulations = simulations.slice(0, 3)
  return (
    <div className="flex-1 space-y-6 p-6">
      <Header title="Dashboard" />
      
      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Total Estimado"
              value={formatCurrency(getTotalValue())}
              description={`Baseado em ${simulations.length} simulações`}
              icon={<DollarSign className="h-4 w-4" />}
              trend="up"
            />
            <MetricCard
              title="Simulações Salvas"
              value={simulations.length.toString()}
              description="Histórico completo"
              icon={<BarChart className="h-4 w-4" />}
              trend="up"
            />
            <MetricCard
              title="Retorno Médio"
              value={`${getAverageReturn().toFixed(1)}%`}
              description="Taxa anual média"
              icon={<TrendingUp className="h-4 w-4" />}
              trend="up"
            />
            <MetricCard
              title="Total Investido"
              value={formatCurrency(getTotalInvested())}
              description="Capital + aportes"
              icon={<Target className="h-4 w-4" />}
              trend="neutral"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Crescimento */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução dos Investimentos</CardTitle>
            <CardDescription>
              Projeção baseada na última simulação ativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimulationChart />
          </CardContent>
        </Card>

        {/* Simulações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Simulações Recentes</CardTitle>
            <CardDescription>
              Suas últimas 3 simulações realizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                ))}
              </>
            ) : recentSimulations.length > 0 ? (
              recentSimulations.map((simulation) => (
                <div key={simulation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{simulation.nome}</h4>
                      <Badge variant="default" className="text-xs">Salva</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{simulation.periodo_anos} anos</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span>Inicial: {formatCurrency(simulation.valor_inicial)}</span>
                      <span className="text-success">
                        Retorno: {formatCurrency(simulation.valor_final)}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">
                  Nenhuma simulação encontrada. 
                  <Button variant="link" className="p-0 h-auto text-sm ml-1">
                    Criar primeira simulação
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dicas de Investimento */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas Inteligentes</CardTitle>
          <CardDescription>
            Insights baseados no seu perfil de investidor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <h4 className="font-medium text-sm mb-2">📈 Diversificação</h4>
              <p className="text-xs text-muted-foreground">
                Considere diversificar 30% em renda variável para maior retorno
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-success/10 to-success/5">
              <h4 className="font-medium text-sm mb-2">💰 Aportes</h4>
              <p className="text-xs text-muted-foreground">
                Aumentar aportes mensais em 20% pode acelerar seus objetivos
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-warning/10 to-warning/5">
              <h4 className="font-medium text-sm mb-2">⏰ Prazo</h4>
              <p className="text-xs text-muted-foreground">
                Investimentos de longo prazo (5+ anos) tendem a ter melhores retornos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}