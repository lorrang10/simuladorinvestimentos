import { BarChart, TrendingUp, DollarSign, Target } from "lucide-react"
import { Header } from "@/components/header"
import { MetricCard } from "@/components/metric-card"
import { SimulationChart } from "@/components/simulation-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const recentSimulations = [
  {
    id: 1,
    name: "CDB Banco Inter",
    type: "Renda Fixa",
    initialValue: 10000,
    return: 15420,
    date: "2024-01-15",
    status: "completed"
  },
  {
    id: 2,
    name: "Tesouro IPCA+",
    type: "Tesouro Direto",
    initialValue: 5000,
    return: 7200,
    date: "2024-01-10",
    status: "completed"
  },
  {
    id: 3,
    name: "Ações VALE3",
    type: "Renda Variável",
    initialValue: 8000,
    return: 9600,
    date: "2024-01-08",
    status: "active"
  }
]

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <Header title="Dashboard" />
      
      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Simulado"
          value="R$ 128.340"
          description="+12% em relação ao mês anterior"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
        />
        <MetricCard
          title="Simulações Ativas"
          value="8"
          description="3 novas nesta semana"
          icon={<BarChart className="h-4 w-4" />}
          trend="up"
        />
        <MetricCard
          title="Retorno Médio"
          value="18,5%"
          description="Baseado em 15 simulações"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        <MetricCard
          title="Meta Mensal"
          value="75%"
          description="R$ 15.000 de R$ 20.000"
          icon={<Target className="h-4 w-4" />}
          trend="neutral"
        />
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
            {recentSimulations.map((simulation) => (
              <div key={simulation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{simulation.name}</h4>
                    <Badge variant={simulation.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {simulation.status === 'active' ? 'Ativa' : 'Concluída'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{simulation.type}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Inicial: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulation.initialValue)}</span>
                    <span className="text-success">
                      Retorno: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulation.return)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            ))}
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