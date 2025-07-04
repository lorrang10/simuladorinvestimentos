import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Tables } from '@/integrations/supabase/types'

type InvestmentSimulation = Tables<'investment_simulations'>

interface SimulationChartProps {
  className?: string
  simulations?: InvestmentSimulation[]
  // Props para simulação ao vivo
  liveSimulation?: {
    valorInicial: number
    valorMensal: number
    taxaJuros: number
    periodoAnos: number
  }
}

export function SimulationChart({ className, simulations, liveSimulation }: SimulationChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Gera dados do gráfico baseado na simulação (salva ou ao vivo)
  const generateChartData = () => {
    let simulationData
    
    if (liveSimulation) {
      // Usa dados da simulação ao vivo
      simulationData = {
        valor_inicial: liveSimulation.valorInicial,
        valor_mensal: liveSimulation.valorMensal,
        taxa_juros: liveSimulation.taxaJuros,
        periodo_anos: liveSimulation.periodoAnos
      }
    } else if (simulations && simulations.length > 0) {
      // Usa simulação mais recente
      const latestSimulation = simulations[0]
      simulationData = {
        valor_inicial: latestSimulation.valor_inicial,
        valor_mensal: latestSimulation.valor_mensal || 0,
        taxa_juros: latestSimulation.taxa_juros,
        periodo_anos: latestSimulation.periodo_anos
      }
    } else {
      return []
    }

    const { valor_inicial, valor_mensal, taxa_juros, periodo_anos } = simulationData
    
    // Validações básicas
    if (!valor_inicial || !taxa_juros || !periodo_anos) {
      return []
    }
    
    const monthlyRate = taxa_juros / 12
    const totalMonths = periodo_anos * 12
    const chartData = []

    let valorInvestido = valor_inicial
    let valorTotal = valor_inicial

    // Mês 0 (valor inicial)
    chartData.push({
      month: 0,
      valorInvestido: valor_inicial,
      valorTotal: valor_inicial
    })

    // Calcula mês a mês
    for (let month = 1; month <= totalMonths; month++) {
      // Adiciona aporte mensal
      valorInvestido += valor_mensal
      
      // Aplica rendimento
      valorTotal = valorTotal * (1 + monthlyRate) + valor_mensal

      chartData.push({
        month,
        valorInvestido,
        valorTotal
      })
    }

    return chartData
  }

  const chartData = generateChartData()

  if (chartData.length === 0) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          <p>Preencha os dados para visualizar a projeção</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => `${value}`}
            label={{ value: 'Meses', position: 'insideBottom', offset: -5 }}
            className="text-xs"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            className="text-xs"
          />
          <Tooltip 
            formatter={(value, name) => [
              formatCurrency(value as number), 
              name === 'valorInvestido' ? 'Valor Investido' : 'Total Acumulado'
            ]}
            labelFormatter={(month) => `Mês ${month}`}
          />
          <Line 
            type="monotone" 
            dataKey="valorInvestido" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="valorTotal" 
            stroke="hsl(var(--success))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}