import { BarChart, TrendingUp, DollarSign, Target } from "lucide-react"
import { Header } from "@/components/header"
import { MetricCard } from "@/components/metric-card"
import { SimulationChart } from "@/components/simulation-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useInvestmentSimulations } from "@/hooks/useInvestmentSimulations"
import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useState } from "react"
import type { Tables } from '@/integrations/supabase/types'

type InvestmentSimulation = Tables<'investment_simulations'>

export default function Dashboard() {
  const { user } = useAuth()
  const { profile } = useUserProfile()
  const { simulations, loading } = useInvestmentSimulations()
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null)

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
  const firstName = profile?.nome_completo?.split(' ')[0] || 'Usuário'

  // Componente para exibir detalhes da simulação
  const SimulationDetailsModal = ({ simulation }: { simulation: InvestmentSimulation }) => {
    const formatPercentage = (value: number) => {
      return `${(value * 100).toFixed(2)}%`
    }

    const totalInvestido = simulation.valor_inicial + ((simulation.valor_mensal || 0) * 12 * simulation.periodo_anos)
    const lucroObtido = simulation.valor_final - totalInvestido

    return (
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{simulation.nome}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Detalhes completos da simulação realizada em {formatDate(simulation.created_at || '')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 sm:gap-6">
          {/* Informações Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Valores Investidos</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor Inicial:</span>
                  <span className="font-medium text-right">{formatCurrency(simulation.valor_inicial)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aporte Mensal:</span>
                  <span className="font-medium text-right">{formatCurrency(simulation.valor_mensal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Investido:</span>
                  <span className="font-medium text-right">{formatCurrency(totalInvestido)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Configurações</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Período:</span>
                  <span className="font-medium text-right">{simulation.periodo_anos.toFixed(2).replace(".", ",")} anos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa de Juros:</span>
                  <span className="font-medium text-right">{formatPercentage(simulation.taxa_juros)} a.a.</span>
                </div>
                {simulation.percentual_manual && simulation.tipo_indexador && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa Manual:</span>
                    <span className="font-medium text-primary text-right">
                      {simulation.tipo_indexador === 'FIXO' 
                        ? `${simulation.percentual_manual}% a.a.`
                        : `${simulation.percentual_manual}% do ${simulation.tipo_indexador}`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Resultados da Simulação</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Valor Final</p>
                <p className="font-bold text-sm sm:text-base lg:text-lg text-primary break-all leading-tight">{formatCurrency(simulation.valor_final)}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-success/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Lucro Obtido</p>
                <p className="font-bold text-sm sm:text-base lg:text-lg text-success break-all leading-tight">{formatCurrency(lucroObtido)}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Rendimento Total</p>
                <p className="font-bold text-sm sm:text-base lg:text-lg break-all leading-tight">{(((simulation.valor_final / totalInvestido) - 1) * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Gráfico da simulação */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Evolução do Investimento</h4>
            <div className="h-[200px] sm:h-[250px]">
              <SimulationChart 
                simulations={[simulation]} 
                selectedSimulationId={simulation.id}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    )
  }
  
  return (
    <div className="flex-1 space-y-6 p-6">
      <Header title={`Olá, ${firstName}!`} />
      
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
            <SimulationChart 
              simulations={simulations} 
              selectedSimulationId={selectedSimulation}
            />
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
                <div 
                  key={simulation.id} 
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between p-3 border rounded-lg transition-colors hover:bg-muted/50 ${
                    selectedSimulation === simulation.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div 
                    className="space-y-1 flex-1 cursor-pointer"
                    onClick={() => setSelectedSimulation(
                      selectedSimulation === simulation.id ? null : simulation.id
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium text-sm">{simulation.nome}</h4>
                      <Badge variant="default" className="text-xs">Salva</Badge>
                      {selectedSimulation === simulation.id && (
                        <Badge variant="secondary" className="text-xs">Selecionada</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{simulation.periodo_anos.toFixed(2).replace(".", ",")} anos</p>
                    {simulation.percentual_manual && simulation.tipo_indexador && (
                      <p className="text-xs text-primary font-medium">
                        {simulation.tipo_indexador === 'FIXO' 
                          ? `${simulation.percentual_manual}% a.a.`
                          : `${simulation.percentual_manual}% do ${simulation.tipo_indexador}`
                        }
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs">
                      <span className="break-all leading-tight">Inicial: {formatCurrency(simulation.valor_inicial)}</span>
                      <span className="text-success break-all leading-tight">
                        Retorno: {formatCurrency(simulation.valor_final)}
                      </span>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="sm:ml-2 w-full sm:w-auto">
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <SimulationDetailsModal simulation={simulation} />
                  </Dialog>
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