import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SimulationChart } from "@/components/simulation-chart"
import { MetricCard } from "@/components/metric-card"
import { TrendingUp, DollarSign, Calendar, Percent, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useInvestmentSimulations } from "@/hooks/useInvestmentSimulations"
import { useUserProfile } from "@/hooks/useUserProfile"
import { PremiumBanner } from "@/components/premium/PremiumBanner"

interface SimulationForm {
  name: string
  type: string
  initialValue: string
  duration: string
  durationType: string
  hasMonthlyContribution: boolean
  monthlyContribution: string
}

export default function SimularInvestimento() {
  const { toast } = useToast()
  const { createSimulation } = useInvestmentSimulations()
  const { isPremium } = useUserProfile()
  const [form, setForm] = useState<SimulationForm>({
    name: "",
    type: "",
    initialValue: "",
    duration: "",
    durationType: "anos",
    hasMonthlyContribution: false,
    monthlyContribution: ""
  })
  const [showResults, setShowResults] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.type || !form.initialValue || !form.duration) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para simular",
        variant: "destructive"
      })
      return
    }

    setShowResults(true)
    toast({
      title: "Simulação realizada!",
      description: "Confira os resultados abaixo",
    })
  }

  const handleNewSimulation = () => {
    setForm({
      name: "",
      type: "",
      initialValue: "",
      duration: "",
      durationType: "anos",
      hasMonthlyContribution: false,
      monthlyContribution: ""
    })
    setShowResults(false)
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(numericValue) / 100)
    return formatted
  }

  const handleCurrencyChange = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, "")
    setForm(prev => ({ ...prev, [field]: numericValue }))
  }

  // Cálculos mockados para demonstração
  const initialValueNum = Number(form.initialValue) / 100
  const monthlyContributionNum = form.hasMonthlyContribution ? Number(form.monthlyContribution) / 100 : 0
  const duration = Number(form.duration)
  const years = form.durationType === "anos" ? duration : duration / 12

  const mockReturns: Record<string, number> = {
    "cdb": 0.12,
    "tesouro": 0.10,
    "acoes": 0.15,
    "fiis": 0.08
  }

  const annualReturn = mockReturns[form.type] || 0.12
  const totalInvested = initialValueNum + (monthlyContributionNum * 12 * years)
  const finalValue = totalInvested * Math.pow(1 + annualReturn, years)
  const profit = finalValue - totalInvested

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header title="Simular Investimento" />
      
      {!isPremium && (
        <PremiumBanner 
          variant="compact" 
          onUpgrade={() => {
            toast({
              title: "Upgrade para Premium",
              description: "Funcionalidade em desenvolvimento",
            })
          }}
        />
      )}
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Simulação</CardTitle>
            <CardDescription>
              Preencha os dados para simular seu investimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Simulação</Label>
                <Input
                  id="name"
                  placeholder="Ex: Reserva de Emergência"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Investimento</Label>
                <Select value={form.type} onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdb">Renda Fixa (CDB)</SelectItem>
                    <SelectItem value="tesouro">Tesouro Direto</SelectItem>
                    <SelectItem value="acoes">Renda Variável (Ações)</SelectItem>
                    <SelectItem value="fiis">Fundos Imobiliários</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialValue">Valor Inicial</Label>
                <Input
                  id="initialValue"
                  placeholder="R$ 0,00"
                  value={formatCurrency(form.initialValue)}
                  onChange={(e) => handleCurrencyChange("initialValue", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Ex: 5"
                    value={form.duration}
                    onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationType">Período</Label>
                  <Select value={form.durationType} onValueChange={(value) => setForm(prev => ({ ...prev, durationType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anos">Anos</SelectItem>
                      <SelectItem value="meses">Meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monthlyContribution"
                  checked={form.hasMonthlyContribution}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, hasMonthlyContribution: checked as boolean }))}
                />
                <Label htmlFor="monthlyContribution">Aportes mensais fixos</Label>
              </div>

              {form.hasMonthlyContribution && (
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Valor do Aporte Mensal</Label>
                  <Input
                    id="monthlyContributionValue"
                    placeholder="R$ 0,00"
                    value={formatCurrency(form.monthlyContribution)}
                    onChange={(e) => handleCurrencyChange("monthlyContribution", e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Simular Investimento
                </Button>
                {showResults && (
                  <Button type="button" variant="outline" onClick={handleNewSimulation}>
                    Nova Simulação
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-6">
          {!showResults ? (
            <Card className="flex items-center justify-center h-64">
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Preencha os campos e clique em "Simular" para ver os resultados
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Métricas dos Resultados */}
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  title="Retorno Total Estimado"
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalValue)}
                  description={`Investimento de ${years} ${years === 1 ? 'ano' : 'anos'}`}
                  icon={<DollarSign className="h-4 w-4" />}
                  trend="up"
                />
                <MetricCard
                  title="Rentabilidade Anual"
                  value={`${(annualReturn * 100).toFixed(1)}%`}
                  description="Taxa estimada a.a."
                  icon={<Percent className="h-4 w-4" />}
                  trend="up"
                />
                <MetricCard
                  title="Lucro Estimado"
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(profit)}
                  description="Ganho sobre o investido"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend="up"
                />
                <MetricCard
                  title="Total Investido"
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
                  description="Capital + aportes"
                  icon={<Calendar className="h-4 w-4" />}
                  trend="neutral"
                />
              </div>

              {/* Gráfico */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Investimento</CardTitle>
                  <CardDescription>
                    Projeção do crescimento ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimulationChart />
                </CardContent>
              </Card>

              {/* Resumo da Simulação */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Simulação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nome:</span>
                      <p className="font-medium">{form.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <p className="font-medium">{form.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor Inicial:</span>
                      <p className="font-medium">{formatCurrency(form.initialValue)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duração:</span>
                      <p className="font-medium">{form.duration} {form.durationType}</p>
                    </div>
                    {form.hasMonthlyContribution && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Aporte Mensal:</span>
                        <p className="font-medium">{formatCurrency(form.monthlyContribution)}</p>
                      </div>
                    )}
                  </div>
                  {isPremium ? (
                    <Button 
                      className="w-full" 
                      onClick={async () => {
                        setSaving(true)
                        await createSimulation({
                          nome: form.name,
                          valor_inicial: initialValueNum,
                          valor_mensal: monthlyContributionNum,
                          taxa_juros: annualReturn,
                          periodo_anos: years,
                          valor_final: finalValue,
                          rendimento_total: profit,
                        })
                        setSaving(false)
                      }}
                      disabled={saving}
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar Simulação
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        disabled
                      >
                        Salvar Simulação (Premium)
                      </Button>
                      <PremiumBanner 
                        variant="detailed"
                        onUpgrade={() => {
                          toast({
                            title: "Upgrade para Premium",
                            description: "Funcionalidade em desenvolvimento",
                          })
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}