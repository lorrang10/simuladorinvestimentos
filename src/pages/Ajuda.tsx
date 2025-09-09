import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate } from "react-router-dom"

const faqItems = [
  {
    id: "1",
    question: "Como funciona o simulador de investimentos?",
    answer: "O simulador utiliza fórmulas financeiras padrão para calcular o retorno estimado dos seus investimentos com base no valor inicial, aportes mensais, tipo de investimento e prazo. Os cálculos são aproximados e servem como referência para planejamento."
  },
  {
    id: "2",
    question: "Os retornos mostrados são garantidos?",
    answer: "Não. As simulações são baseadas em projeções e médias históricas. Investimentos envolvem riscos e os retornos reais podem variar significativamente. Sempre consulte um especialista antes de tomar decisões financeiras."
  },
  {
    id: "3",
    question: "Posso salvar minhas simulações?",
    answer: "Sim! Você pode salvar quantas simulações quiser e acessá-las na seção 'Meus Investimentos'. Isso permite comparar diferentes cenários e acompanhar seu planejamento financeiro."
  },
  {
    id: "4",
    question: "Como alterar meu perfil de investidor?",
    answer: "Acesse 'Configurações' no menu lateral e altere seu perfil de investidor. Isso pode influenciar as sugestões de investimentos e os cálculos de retorno apresentados."
  },
  {
    id: "5",
    question: "Posso exportar minhas simulações?",
    answer: "Atualmente, você pode visualizar e imprimir os relatórios das simulações. Em breve, adicionaremos a funcionalidade de exportar para PDF e Excel."
  },
  {
    id: "6",
    question: "Como funciona o cálculo de juros compostos?",
    answer: "Utilizamos a fórmula padrão: M = C × (1 + i)^t, onde M é o montante final, C o capital inicial, i a taxa de juros e t o tempo. Para aportes mensais, calculamos o valor futuro de cada aporte individualmente."
  }
]

const tutorialSteps = [
  {
    step: 1,
    title: "Acesse o Simulador",
    description: "Clique em 'Simular Investimento' no menu lateral para começar uma nova simulação."
  },
  {
    step: 2,
    title: "Preencha os Dados",
    description: "Insira o nome da simulação, tipo de investimento, valor inicial e duração desejada."
  },
  {
    step: 3,
    title: "Configure Aportes",
    description: "Marque a opção 'Aportes mensais' se quiser adicionar contribuições regulares."
  },
  {
    step: 4,
    title: "Visualize os Resultados",
    description: "Clique em 'Simular' para ver o retorno estimado, gráficos e detalhes da projeção."
  },
  {
    step: 5,
    title: "Salve a Simulação",
    description: "Use o botão 'Salvar Simulação' para guardar seus cenários e comparar depois."
  }
]

export default function Ajuda() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header title="Ajuda & Suporte" />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tutorial Rápido */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Como Usar o InvestSmart</CardTitle>
            <CardDescription>
              Aprenda a simular seus investimentos em 5 passos simples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tutorialSteps.map((step) => (
                <div key={step.step} className="flex gap-4 p-4 border rounded-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links Rápidos */}
        <Card>
          <CardHeader>
            <CardTitle>Links Úteis</CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/simular-investimento')}
            >
              📊 Nova Simulação
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/meus-investimentos')}
            >
              📁 Meus Investimentos
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/configuracoes')}
            >
              ⚙️ Configurações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
          <CardDescription>
            Encontre respostas para as dúvidas mais comuns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Status do Sistema */}
      <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>
              Verificação da saúde dos nossos serviços
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Simulador de Investimentos</span>
              <Badge className="bg-success text-success-foreground">
                ✓ Operacional
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Base de Dados</span>
              <Badge className="bg-success text-success-foreground">
                ✓ Operacional
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Relatórios</span>
              <Badge className="bg-success text-success-foreground">
                ✓ Operacional
              </Badge>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm">
                <p className="font-medium">Última atualização:</p>
                <p className="text-muted-foreground">Hoje às 14:30</p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}