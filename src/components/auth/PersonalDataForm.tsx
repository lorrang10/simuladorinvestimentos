import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TrendingUp, Loader2 } from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useFirstTimeUser } from "@/hooks/useFirstTimeUser"
import { useNavigate } from "react-router-dom"

const personalDataSchema = z.object({
  nome_completo: z.string().min(1, "Nome completo é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  perfil_risco: z.enum(["conservador", "moderado", "arrojado"], {
    required_error: "Selecione um perfil de risco",
  }),
  objetivo_investimento: z.enum(["aposentadoria", "casa_propria", "educacao", "emergencia", "outros"], {
    required_error: "Selecione um objetivo de investimento",
  }),
})

type PersonalDataForm = z.infer<typeof personalDataSchema>

interface PersonalDataFormProps {
  onComplete: () => void
}

export function PersonalDataForm({ onComplete }: PersonalDataFormProps) {
  const [loading, setLoading] = useState(false)
  const { updateProfile } = useUserProfile()
  const { isFirstTimeUser } = useFirstTimeUser()
  const navigate = useNavigate()

  const form = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      nome_completo: "",
      telefone: "",
      data_nascimento: "",
      perfil_risco: undefined,
      objetivo_investimento: undefined,
    },
  })

  const onSubmit = async (data: PersonalDataForm) => {
    setLoading(true)
    try {
      await updateProfile(data)
      onComplete()
      
      // Redirecionar para simulação apenas se for usuário de primeira vez
      // Usar timeout para garantir que o perfil foi atualizado
      setTimeout(() => {
        if (isFirstTimeUser) {
          navigate('/simular')
        }
      }, 100)
    } catch (error) {
      console.error('Erro ao salvar dados pessoais:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">InvestSmart</span>
          </div>
          <div>
            <CardTitle className="text-2xl">Complete seu perfil</CardTitle>
            <CardDescription>
              Para personalizar sua experiência, precisamos de algumas informações
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome_completo"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu perfil" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu objetivo" />
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
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Completar Cadastro
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}