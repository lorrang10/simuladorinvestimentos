import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

interface Investment {
  id: number
  name: string
  type: string
  initialValue: number
  duration: string
  monthlyContribution?: number
  estimatedReturn: number
  createdAt: string
  status: "active" | "completed" | "draft"
}

const mockInvestments: Investment[] = [
  {
    id: 1,
    name: "Reserva de Emergência",
    type: "Renda Fixa (CDB)",
    initialValue: 10000,
    duration: "2 anos",
    monthlyContribution: 500,
    estimatedReturn: 15420,
    createdAt: "2024-01-15",
    status: "active"
  },
  {
    id: 2,
    name: "Aposentadoria",
    type: "Tesouro Direto",
    initialValue: 25000,
    duration: "15 anos",
    monthlyContribution: 1000,
    estimatedReturn: 185000,
    createdAt: "2024-01-10",
    status: "active"
  },
  {
    id: 3,
    name: "Compra do Carro",
    type: "Renda Variável (Ações)",
    initialValue: 5000,
    duration: "3 anos",
    estimatedReturn: 9200,
    createdAt: "2024-01-08",
    status: "completed"
  },
  {
    id: 4,
    name: "Casa Própria",
    type: "Fundos Imobiliários",
    initialValue: 50000,
    duration: "10 anos",
    monthlyContribution: 2000,
    estimatedReturn: 320000,
    createdAt: "2024-01-05",
    status: "active"
  },
  {
    id: 5,
    name: "Viagem dos Sonhos",
    type: "Renda Fixa (CDB)",
    initialValue: 8000,
    duration: "1 ano",
    monthlyContribution: 300,
    estimatedReturn: 12500,
    createdAt: "2024-01-02",
    status: "draft"
  }
]

export default function MeusInvestimentos() {
  const { toast } = useToast()
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInvestments = investments.filter(investment =>
    investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investment.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id))
    toast({
      title: "Simulação excluída",
      description: "A simulação foi removida permanentemente",
    })
  }

  const handleView = (investment: Investment) => {
    toast({
      title: "Visualizando simulação",
      description: `Abrindo detalhes de "${investment.name}"`,
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

  const getStatusBadge = (status: Investment['status']) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Ativa' },
      completed: { variant: 'secondary' as const, label: 'Concluída' },
      draft: { variant: 'outline' as const, label: 'Rascunho' }
    }
    
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTotalValue = () => {
    return investments.reduce((total, inv) => total + inv.estimatedReturn, 0)
  }

  const getActiveCount = () => {
    return investments.filter(inv => inv.status === 'active').length
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
            <div className="text-2xl font-bold">{investments.length}</div>
            <p className="text-xs text-muted-foreground">
              {getActiveCount()} ativas
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
              {formatCurrency(getTotalValue() / investments.length)}
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Simulação
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Simulação</TableHead>
                  <TableHead>Tipo de Investimento</TableHead>
                  <TableHead>Valor Inicial</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Aportes Mensais</TableHead>
                  <TableHead>Retorno Estimado</TableHead>
                  <TableHead>Data da Simulação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">
                      {investment.name}
                    </TableCell>
                    <TableCell>{investment.type}</TableCell>
                    <TableCell>{formatCurrency(investment.initialValue)}</TableCell>
                    <TableCell>{investment.duration}</TableCell>
                    <TableCell>
                      {investment.monthlyContribution 
                        ? formatCurrency(investment.monthlyContribution)
                        : "—"
                      }
                    </TableCell>
                    <TableCell className="text-success font-medium">
                      {formatCurrency(investment.estimatedReturn)}
                    </TableCell>
                    <TableCell>{formatDate(investment.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(investment.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(investment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(investment.id)}
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