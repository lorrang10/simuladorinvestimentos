import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
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
  category: string
  type: string
  initialValue: string
  duration: string
  durationType: string
  hasMonthlyContribution: boolean
  monthlyContribution: string
}

interface InvestmentCategory {
  id: string
  name: string
  types: InvestmentType[]
}

interface InvestmentType {
  id: string
  name: string
  description: string
  currentRate?: number
}

const investmentCategories: InvestmentCategory[] = [
  {
    id: 'renda-fixa',
    name: 'Renda Fixa',
    types: [
      {
        id: 'tesouro-direto',
        name: 'Tesouro Direto',
        description: 'Títulos públicos do governo federal'
      },
      {
        id: 'cdb',
        name: 'CDB (Certificado de Depósito Bancário)',
        description: 'Investimento em bancos com garantia do FGC'
      },
      {
        id: 'lci',
        name: 'LCI (Letra de Crédito Imobiliário)',
        description: 'Investimento do setor imobiliário, isento de IR'
      },
      {
        id: 'lca',
        name: 'LCA (Letra de Crédito do Agronegócio)',
        description: 'Investimento do agronegócio, isento de IR'
      },
      {
        id: 'debentures',
        name: 'Debêntures',
        description: 'Títulos de dívida corporativa'
      },
      {
        id: 'letras-cambio',
        name: 'Letras de Câmbio',
        description: 'Títulos de financeiras e sociedades de crédito'
      }
    ]
  }
]

export default function SimularInvestimento() {
  const { toast } = useToast()
  const { createSimulation } = useInvestmentSimulations()
  const { isPremium } = useUserProfile()
  const [form, setForm] = useState<SimulationForm>({
    name: "",
    category: "",
    type: "",
    initialValue: "",
    duration: "",
    durationType: "anos",
    hasMonthlyContribution: false,
    monthlyContribution: ""
  })
  const [investmentRates, setInvestmentRates] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingRates, setLoadingRates] = useState(false)

  // Buscar taxas reais ao carregar a página
  useEffect(() => {
    fetchInvestmentRates()
  }, [])

  const fetchInvestmentRates = async () => {
    setLoadingRates(true)
    try {
      const { data, error } = await supabase.functions.invoke('get-investment-rates')
      
      if (error) throw error
      
      if (data?.rates) {
        const rates: Record<string, number> = {}
        Object.entries(data.rates).forEach(([key, value]: [string, any]) => {
          rates[key] = value.rate
        })
        setInvestmentRates(rates)
      }
    } catch (error) {
      console.error('Error fetching investment rates:', error)
      toast({
        title: "Aviso",
        description: "Não foi possível obter as taxas atualizadas. Usando taxas estimadas.",
        variant: "default",
      })
    } finally {
      setLoadingRates(false)
    }
  }

  // Função para buscar taxa específica de um investimento
  const getCurrentRate = (investmentType: string): number => {
    return investmentRates[investmentType] || 0.12 // fallback para 12%
  }

  const selectedCategory = investmentCategories.find(cat => cat.id === form.category)
  const availableTypes = selectedCategory?.types || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.category || !form.type || !form.initialValue || !form.duration) {
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
      category: "",
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

  // Cálculos usando taxas reais
  const initialValueNum = Number(form.initialValue) / 100
  const monthlyContributionNum = form.hasMonthlyContribution ? Number(form.monthlyContribution) / 100 : 0
  const duration = Number(form.duration)
  const years = form.durationType === "anos" ? duration : duration / 12

  // Usar taxa real do investimento selecionado
  const annualReturn = form.type ? getCurrentRate(form.type) : 0.12
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
                <Label htmlFor="category">Categoria de Investimento</Label>
                <Select 
                  value={form.category} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, category: value, type: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.category && (
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Investimento</Label>
                  <Select 
                    value={form.type} 
                    onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((type) => {
                        const currentRate = getCurrentRate(type.id)
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex flex-col">
                              <span>{type.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {loadingRates ? 'Carregando...' : `Taxa atual: ${(currentRate * 100).toFixed(2)}% a.a.`}
                              </span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {form.type && (
                    <p className="text-sm text-muted-foreground">
                      {availableTypes.find(t => t.id === form.type)?.description}
                    </p>
                  )}
                </div>
              )}

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
                      <p className="font-medium">
                        {availableTypes.find(t => t.id === form.type)?.name || form.type}
                      </p>
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