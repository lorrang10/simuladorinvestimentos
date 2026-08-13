import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import {
  Loader2,
  TrendingUp,
  CheckCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LineChart,
  Wallet,
  LogIn,
  UserPlus,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import heroImg from "@/assets/auth-hero.jpg"

const features = [
  { icon: ShieldCheck, title: "Seguro", desc: "Seus dados protegidos com criptografia" },
  { icon: LineChart, title: "Taxas reais", desc: "CDI, Selic e IPCA direto do Banco Central" },
  { icon: Wallet, title: "Líquido", desc: "Rendimento já com imposto de renda" },
]

const fieldClass =
  "h-11 border-border/60 bg-input/30 pl-10 backdrop-blur-sm focus-visible:border-primary/60"

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"signin" | "signup">("signin")
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [passMismatch, setPassMismatch] = useState(false)
  const { signIn, signUp } = useAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("confirmed") === "true") {
      setEmailConfirmed(true)
      setTab("signin")
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await signIn(formData.get("email") as string, formData.get("password") as string)
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPassMismatch(false)
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setPassMismatch(true)
      return
    }

    setLoading(true)
    const { error } = await signUp(formData.get("email") as string, password)
    if (!error) setTab("signin")
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <img
        src={heroImg}
        alt=""
        aria-hidden
        width={1280}
        height={1600}
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[38rem] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[32rem] rounded-full bg-accent/15 blur-[130px]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-10 px-5 py-8 lg:grid-cols-2 lg:items-center lg:px-10">
        {/* Marca + pitch */}
        <div className="flex flex-col justify-center gap-10">
          <div className="flex items-center gap-3">
            <div className="brand-gradient grid size-10 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-[var(--shadow-float)]">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Invest<span className="text-primary">Smart</span>
            </span>
          </div>

          <div className="hidden space-y-5 lg:block">
            <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-tight">
              Simule seus <span className="text-primary">investimentos</span>
              <br />
              com números reais.
            </h1>
            <p className="max-w-md text-muted-foreground">
              CDI, Selic e IPCA atualizados, imposto de renda calculado e projeções claras do seu
              rendimento líquido — tudo em um só lugar.
            </p>
          </div>

          <div className="hidden gap-3 sm:grid sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-primary/15 bg-card/40 p-4 backdrop-blur-md transition-colors hover:border-primary/40"
              >
                <f.icon className="mb-3 size-5 text-primary" />
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-primary/20 bg-card/60 p-6 shadow-[0_25px_80px_-20px_hsl(222_60%_2%/0.8)] backdrop-blur-2xl sm:p-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 grid size-16 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary shadow-[var(--shadow-float)]">
                <TrendingUp className="size-7" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {tab === "signin" ? "Acessar sua conta" : "Criar sua conta"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {tab === "signin"
                  ? "Entre com seu email e senha para continuar."
                  : "Leva menos de um minuto para começar a simular."}
              </p>
            </div>

            {emailConfirmed && (
              <Alert className="mb-5 border-success/40 bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-foreground">
                  Email confirmado com sucesso! Agora você pode fazer login.
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-border/50 bg-muted/30 p-1">
              {(
                [
                  { key: "signin", label: "Entrar", icon: LogIn },
                  { key: "signup", label: "Cadastrar", icon: UserPlus },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    tab === t.key
                      ? "bg-primary/20 text-primary shadow-[var(--shadow-primary)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <t.icon className="size-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      className={fieldClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Senha</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      placeholder="Sua senha"
                      autoComplete="current-password"
                      className={cn(fieldClass, "pr-10")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-11 w-full text-base font-semibold" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      className={fieldClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      minLength={6}
                      className={cn(fieldClass, "pr-10")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-confirm"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      autoComplete="new-password"
                      className={fieldClass}
                      required
                    />
                  </div>
                  {passMismatch && (
                    <p className="text-xs text-destructive">As senhas não conferem.</p>
                  )}
                </div>

                <Button type="submit" className="h-11 w-full text-base font-semibold" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cadastrar
                </Button>
              </form>
            )}

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Ambiente 100% seguro e confiável
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
