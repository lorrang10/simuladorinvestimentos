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
import { AdBanner } from "@/components/ads/AdBanner"
import { useInterstitialAd } from "@/utils/adInterstitial"
import { calculateTax, getTaxRegime } from "@/utils/investmentTax"

interface SimulationForm {
  name: string
  category: string
  type: string
  initialValue: string
  duration: string
  durationType: string
  hasMonthlyContribution: boolean
  monthlyContribution: string
  useManualRate: boolean
  manualPercentage: string
  indexerType: string
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
  },
  {
    id: 'renda-variavel',
    name: 'Renda Variável',
    types: [
      {
        id: 'acoes',
        name: 'Ações',
        description: 'Investimento em ações da bolsa de valores (baseado no Ibovespa)'
      },
      {
        id: 'etfs',
        name: 'ETFs',
        description: 'Fundos de índice que replicam carteiras diversificadas'
      },
      {
        id: 'fiis',
        name: 'FIIs (Fundos Imobiliários)',
        description: 'Investimento em fundos do setor imobiliário'
      }
    ]
  }
]

export default function SimularInvestimento() {
  const { toast } = useToast()
  const { createSimulation, simulations } = useInvestmentSimulations()
  const { isPremium } = useUserProfile()
  const { showAdAfterSimulation, prepareNextAd } = useInterstitialAd()
  const [form, setForm] = useState<SimulationForm>({
    name: "",
    category: "",
    type: "",
    initialValue: "",
    duration: "",
    durationType: "anos",
    hasMonthlyContribution: false,
    monthlyContribution: "",
    useManualRate: false,
    manualPercentage: "",
    indexerType: "CDI"
  })
  const [investmentRates, setInvestmentRates] = useState<Record<string, number>>({})
  const [ratesSource, setRatesSource] = useState<string>('')
  const [ratesLastUpdated, setRatesLastUpdated] = useState<string>('')
  const [showResults, setShowResults] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingRates, setLoadingRates] = useState(false)

  // Buscar taxas reais ao carregar a página
  useEffect(() => {
    fetchInvestmentRates()
    prepareNextAd() // Preparar anúncio intersticial para mobile
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
        setRatesSource(data.source || 'API')
        setRatesLastUpdated(data.lastUpdated || new Date().toISOString())
        
        toast({
          title: "Taxas atualizadas!",
          description: `Dados obtidos do ${data.source || 'sistema'} em ${new Date(data.lastUpdated).toLocaleString('pt-BR')}`,
        })
      }
    } catch (error) {
      console.error('Error fetching investment rates:', error)
      toast({
        title: "Erro ao buscar taxas",
        description: "Usando taxas de referência. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoadingRates(false)
    }
  }

  // Função para buscar taxa específica de um investimento
  const getCurrentRate = (investmentType: string): number => {
    return investmentRates[investmentType] || 0.12 // fallback para 12%
  }
  
  // Função para calcular taxa com percentual manual
  const calculateManualRate = (percentage: string, indexer: string): number => {
    const percentageNum = parseFloat(percentage)
    if (isNaN(percentageNum)) return 0.12
    
    let baseRate = 0.12 // taxa padrão
    
    switch (indexer) {
      case 'CDI':
        baseRate = investmentRates['cdi'] || 0.1075
        break
      case 'SELIC':
        baseRate = investmentRates['selic'] || 0.105
        break
      case 'IPCA':
        baseRate = investmentRates['ipca'] || 0.045
        break
      case 'FIXO':
        return percentageNum / 100
    }
    
    return (baseRate * percentageNum) / 100
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

    if (Number(form.duration) <= 0) {
      toast({
        title: "Duração inválida",
        description: "A duração do investimento deve ser um número positivo.",
        variant: "destructive"
      })
      return
    }

    setShowResults(true)
    toast({
      title: "Simulação realizada!",
      description: "Confira os resultados abaixo",
    })
    
    // Mostrar anúncio intersticial no mobile após simulação (alto eCPM)
    if (!isPremium) {
      setTimeout(() => showAdAfterSimulation(), 1500)
    }
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
      monthlyContribution: "",
      useManualRate: false,
      manualPercentage: "",
      indexerType: "CDI"
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

  // Usar taxa manual ou taxa real do investimento selecionado
  const annualReturn = form.useManualRate 
    ? calculateManualRate(form.manualPercentage, form.indexerType)
    : (form.type ? getCurrentRate(form.type) : 0.12)
  
  // Cálculo correto de juros compostos com aportes mensais
  const monthlyRate = annualReturn / 12
  const totalMonths = years * 12
  const totalInvested = initialValueNum + (monthlyContributionNum * totalMonths)
  
  // Calcular valor final com juros compostos mês a mês
  let finalValue = initialValueNum
  for (let month = 1; month <= totalMonths; month++) {
    // Aplica rendimento no saldo atual
    finalValue = finalValue * (1 + monthlyRate)
    // Adiciona aporte mensal
    finalValue += monthlyContributionNum
  }
  
  const profit = finalValue - totalInvested

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 overflow-x-hidden max-w-full">
      <Header title="Simular Investimento" />
      
      {/* Anúncio no topo para usuários free */}
      <AdBanner 
        variant="top"
        showUpgradeHint={false}
      />
      
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
      
      {/* Status das Taxas */}
      {ratesSource && (
        <Card className="border-success/20 bg-success/5">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-black font-medium">
                  Taxas em tempo real ativas
                </span>
              </div>
              <div className="text-muted-foreground">
                Fonte: {ratesSource} | Atualizado: {new Date(ratesLastUpdated).toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-success/20">
              <p className="text-sm text-muted-foreground">
                <strong>Importante:</strong> As taxas de Renda Fixa são atualizadas com dados do Banco Central (Selic/CDI). 
                As taxas de Renda Variável são estimativas baseadas em médias históricas e podem variar significativamente. 
                Todas as projeções são para fins educacionais e não constituem recomendação de investimento.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 lg:grid-cols-2 w-full max-w-full">
        {/* Formulário */}
        <Card className="min-w-0">
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
                                {loadingRates ? (
                                  <div className="flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Atualizando taxa...
                                  </div>
                                ) : (
                                  `Taxa atual: ${(currentRate * 100).toFixed(2)}% a.a.`
                                )}
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

              {/* Seção de Taxa Manual */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useManualRate"
                    checked={form.useManualRate}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, useManualRate: checked as boolean }))}
                  />
                  <Label htmlFor="useManualRate" className="text-sm font-medium">
                    Usar percentual manual (ex: 120% do CDI)
                  </Label>
                </div>

                {form.useManualRate && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manualPercentage">Percentual (%)</Label>
                      <Input
                        id="manualPercentage"
                        type="number"
                        value={form.manualPercentage}
                        onChange={(e) => setForm(prev => ({ ...prev, manualPercentage: e.target.value }))}
                        placeholder="120"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="indexerType">Indexador</Label>
                      <Select 
                        value={form.indexerType} 
                        onValueChange={(value) => setForm(prev => ({ ...prev, indexerType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CDI">CDI</SelectItem>
                          <SelectItem value="SELIC">SELIC</SelectItem>
                          <SelectItem value="IPCA">IPCA</SelectItem>
                          <SelectItem value="FIXO">Taxa Fixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {form.useManualRate && form.manualPercentage && (
                  <div className="text-sm text-muted-foreground">
                    <span>Taxa calculada: </span>
                    <span className="font-medium text-foreground">
                      {form.indexerType === 'FIXO' 
                        ? `${form.manualPercentage}% a.a.`
                        : `${form.manualPercentage}% do ${form.indexerType} = ${(calculateManualRate(form.manualPercentage, form.indexerType) * 100).toFixed(2)}% a.a.`
                      }
                    </span>
                  </div>
                )}
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
                <Button type="submit" className="flex-1" disabled={loadingRates}>
                  {loadingRates && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simular Investimento
                </Button>
                {showResults && (
                  <Button type="button" variant="outline" onClick={handleNewSimulation}>
                    Nova Simulação
                  </Button>
                )}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={fetchInvestmentRates}
                  disabled={loadingRates}
                  title="Atualizar taxas em tempo real"
                >
                  {loadingRates ? <Loader2 className="h-4 w-4 animate-spin" /> : "🔄"}
                </Button>
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
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-full">
                <MetricCard
                  title="Retorno Total Estimado"
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalValue)}
                  description={`Investimento de ${years.toFixed(2).replace('.', ',')} ${years === 1 ? 'ano' : 'anos'}`}
                  icon={<DollarSign className="h-4 w-4" />}
                  trend="up"
                />
                <MetricCard
                  title="Rendimento Total"
                  value={`${(((finalValue / totalInvested) - 1) * 100).toFixed(2)}%`}
                  description="Percentual de ganho total"
                  icon={<TrendingUp className="h-4 w-4" />}
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

              {/* Anúncio nativo entre métricas e gráfico - Alto ROI */}
              <AdBanner 
                variant="inline"
                showUpgradeHint={true}
              />

              {/* Gráfico */}
              <Card className="min-w-0 w-full">
                <CardHeader>
                  <CardTitle>Evolução do Investimento</CardTitle>
                  <CardDescription>
                    Projeção do crescimento ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 lg:p-6">
                  <div className="w-full overflow-x-auto">
                    <SimulationChart 
                      liveSimulation={{
                        valorInicial: initialValueNum,
                        valorMensal: monthlyContributionNum,
                        taxaJuros: annualReturn,
                        periodoAnos: years
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Anúncio entre gráfico e resumo para usuários free */}
              <AdBanner 
                variant="inline"
                onUpgradeClick={() => {
                  toast({
                    title: "Upgrade para Premium",
                    description: "Funcionalidade em desenvolvimento",
                  })
                }}
              />

              {/* Resumo da Simulação */}
              <Card className="min-w-0 w-full">
                <CardHeader>
                  <CardTitle>Resumo da Simulação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                      <div className="sm:col-span-2">
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
                          percentual_manual: form.useManualRate ? parseFloat(form.manualPercentage) : null,
                          tipo_indexador: form.useManualRate ? form.indexerType : null,
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
               
               {/* Anúncio no final dos resultados para usuários free */}
               <AdBanner 
                 variant="bottom"
                 showUpgradeHint={true}
                 onUpgradeClick={() => {
                   toast({
                     title: "Upgrade para Premium", 
                     description: "Funcionalidade em desenvolvimento",
                   })
                 }}
               />
             </>
          )}
        </div>
      </div>
    </div>
  )
}