import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Loader2 } from "lucide-react"

const profileSchema = z.object({
  nome_completo: z.string().min(1, "Nome completo é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  perfil_risco: z.enum(["conservador", "moderado", "arrojado"]),
  objetivo_investimento: z.enum(["aposentadoria", "casa_propria", "educacao", "emergencia", "outros"]),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function Configuracoes() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { profile, updateProfile } = useUserProfile()

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome_completo: "",
      telefone: "",
      data_nascimento: "",
      perfil_risco: "moderado",
      objetivo_investimento: "aposentadoria",
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        nome_completo: profile.nome_completo || "",
        telefone: profile.telefone || "",
        data_nascimento: profile.data_nascimento || "",
        perfil_risco: (profile.perfil_risco as "conservador" | "moderado" | "arrojado") || "moderado",
        objetivo_investimento: (profile.objetivo_investimento as "aposentadoria" | "casa_propria" | "educacao" | "emergencia" | "outros") || "aposentadoria",
      })
    }
  }, [profile, form])

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true)
    try {
      await updateProfile(data)
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header title="Configurações" />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome_completo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled />
                </div>

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_nascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perfil_risco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil de Risco</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="conservador">Conservador</SelectItem>
                          <SelectItem value="moderado">Moderado</SelectItem>
                          <SelectItem value="arrojado">Arrojado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objetivo_investimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo de Investimento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                          <SelectItem value="casa_propria">Casa Própria</SelectItem>
                          <SelectItem value="educacao">Educação</SelectItem>
                          <SelectItem value="emergencia">Reserva de Emergência</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Perfil
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preferências de Simulação */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Simulação</CardTitle>
            <CardDescription>
              Configure como as simulações são calculadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultInvestment">Investimento Padrão</Label>
              <Select defaultValue="cdb">
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="defaultPeriod">Período Padrão</Label>
              <Select defaultValue="anos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meses">Meses</SelectItem>
                  <SelectItem value="anos">Anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select defaultValue="brl">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brl">Real (BRL)</SelectItem>
                  <SelectItem value="usd">Dólar (USD)</SelectItem>
                  <SelectItem value="eur">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre suas simulações
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Mensais</Label>
                <p className="text-sm text-muted-foreground">
                  Resumo mensal dos seus investimentos
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dicas de Investimento</Label>
                <p className="text-sm text-muted-foreground">
                  Receba sugestões personalizadas
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas no navegador
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Gerencie a segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação em Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Zona de Perigo */}
      <Card className="border-danger">
        <CardHeader>
          <CardTitle className="text-danger">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Excluir todas as simulações</h4>
              <p className="text-sm text-muted-foreground">
                Remove permanentemente todas as suas simulações
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-danger border-danger hover:bg-danger hover:text-danger-foreground">
              Excluir Simulações
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Excluir conta</h4>
              <p className="text-sm text-muted-foreground">
                Remove permanentemente sua conta e todos os dados
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}