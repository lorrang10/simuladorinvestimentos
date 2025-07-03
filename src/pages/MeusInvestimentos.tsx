import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
            <div className="text-2xl font-bold">{simulations.length}</div>
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
            <div className="text-2xl font-bold text-success">
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
            <div className="text-2xl font-bold">
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
                    <TableRow key={simulation.id}>
                      <TableCell className="font-medium">
                        {simulation.nome}
                      </TableCell>
                      <TableCell>{formatCurrency(simulation.valor_inicial)}</TableCell>
                      <TableCell>
                        {simulation.valor_mensal > 0 
                          ? formatCurrency(simulation.valor_mensal)
                          : "—"
                        }
                      </TableCell>
                      <TableCell>{simulation.periodo_anos} anos</TableCell>
                      <TableCell>{(simulation.taxa_juros * 100).toFixed(1)}%</TableCell>
                      <TableCell className="text-success font-medium">
                        {formatCurrency(simulation.valor_final)}
                      </TableCell>
                      <TableCell>{formatDate(simulation.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
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