import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockData = [
  { month: 0, valor: 10000, total: 10000 },
  { month: 6, valor: 13000, total: 16000 },
  { month: 12, valor: 16900, total: 22900 },
  { month: 18, valor: 21970, total: 30870 },
  { month: 24, valor: 28561, total: 40561 },
  { month: 30, valor: 37129, total: 52129 },
  { month: 36, valor: 48268, total: 66268 },
]

interface SimulationChartProps {
  className?: string
}

export function SimulationChart({ className }: SimulationChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => `${value}m`}
            className="text-xs"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            className="text-xs"
          />
          <Tooltip 
            formatter={(value, name) => [formatCurrency(value as number), name === 'valor' ? 'Valor Investido' : 'Total Acumulado']}
            labelFormatter={(month) => `Mês ${month}`}
          />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="hsl(var(--success))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}