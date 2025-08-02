import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { SimulationChart } from "@/components/simulation-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Trash2, Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useInvestmentSimulations } from "@/hooks/useInvestmentSimulations"
import type { Tables } from '@/integrations/supabase/types'

type InvestmentSimulation = Tables<'investment_simulations'>

export default function MeusInvestimentos() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { simulations, loading, deleteSimulation } = useInvestmentSimulations()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInvestments = simulations.filter(simulation =>
    simulation.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    await deleteSimulation(id)
  }

  const handleView = (simulation: any) => {
    toast({
      title: "Visualizando simulação",
      description: `Abrindo detalhes de "${simulation.nome}"`,
    })
  }

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

  const getActiveCount = () => {
    return simulations.length
  }

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
                  <span className="font-medium text-right break-all">{formatCurrency(simulation.valor_inicial)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aporte Mensal:</span>
                  <span className="font-medium text-right break-all">{formatCurrency(simulation.valor_mensal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Investido:</span>
                  <span className="font-medium text-right break-all">{formatCurrency(totalInvestido)}</span>
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
                <p className="font-bold text-sm sm:text-base lg:text-lg break-all leading-tight">{formatPercentage(simulation.rendimento_total)}</p>
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
      <Header title="Meus Investimentos" />
      
      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Simulações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold break-all leading-tight">{simulations.length}</div>
            <p className="text-xs text-muted-foreground">
              simulações salvas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Retorno Total Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-success break-all leading-tight">
              {formatCurrency(getTotalValue())}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em todas as simulações
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Investimento Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold break-all leading-tight">
              {simulations.length > 0 ? formatCurrency(getTotalValue() / simulations.length) : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              Por simulação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Histórico de Simulações</CardTitle>
              <CardDescription>
                Gerencie todas as suas simulações de investimento
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar simulações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => navigate('/simular')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Simulação
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Simulação</TableHead>
                    <TableHead>Valor Inicial</TableHead>
                    <TableHead>Aportes Mensais</TableHead>
                    <TableHead>Período (anos)</TableHead>
                    <TableHead>Taxa a.a.</TableHead>
                    <TableHead>Retorno Final</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-12">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestments.map((simulation) => (
                    <Dialog key={simulation.id}>
                      <DialogTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{simulation.nome}</span>
                              {simulation.percentual_manual && simulation.tipo_indexador && (
                                <span className="text-xs text-primary font-medium">
                                  {simulation.tipo_indexador === 'FIXO' 
                                    ? `${simulation.percentual_manual}% a.a.`
                                    : `${simulation.percentual_manual}% do ${simulation.tipo_indexador}`
                                  }
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(simulation.valor_inicial)}</TableCell>
                          <TableCell>
                            {simulation.valor_mensal && simulation.valor_mensal > 0 
                              ? formatCurrency(simulation.valor_mensal)
                              : "—"
                            }
                          </TableCell>
                          <TableCell>{simulation.periodo_anos.toFixed(2).replace(".", ",")} anos</TableCell>
                          <TableCell>{(simulation.taxa_juros * 100).toFixed(1)}%</TableCell>
                          <TableCell className="text-success font-medium">
                            {formatCurrency(simulation.valor_final)}
                          </TableCell>
                          <TableCell>{formatDate(simulation.created_at || '')}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(simulation)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(simulation.id)}
                                  className="text-danger"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </DialogTrigger>
                      <SimulationDetailsModal simulation={simulation} />
                    </Dialog>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {filteredInvestments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Nenhuma simulação encontrada com os filtros aplicados"
                  : "Nenhuma simulação encontrada"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}