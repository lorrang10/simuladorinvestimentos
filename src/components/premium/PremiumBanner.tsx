import { Crown, Star, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PremiumBannerProps {
  variant?: "compact" | "detailed"
  onUpgrade?: () => void
}

export function PremiumBanner({ variant = "compact", onUpgrade }: PremiumBannerProps) {
  if (variant === "compact") {
    return (
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Upgrade para Premium</p>
                <p className="text-xs text-muted-foreground">Salve simulações e acesse recursos exclusivos</p>
              </div>
            </div>
            <Button size="sm" onClick={onUpgrade}>
              Assinar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Upgrade para Premium</CardTitle>
        </div>
        <CardDescription>
          Desbloqueie todo o potencial do InvestSmart
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm">Salvar simulações ilimitadas</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm">Dashboard completo com métricas avançadas</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm">Histórico detalhado de investimentos</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm">Relatórios e análises personalizados</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm">Suporte prioritário</span>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={onUpgrade}
            className="w-full"
            size="lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            Assinar Premium - R$ 29,90/mês
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Cancele a qualquer momento
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function PremiumFeatureLock({ feature }: { feature: string }) {
  return (
    <div className="flex items-center justify-center p-6 border-2 border-dashed border-muted rounded-lg bg-muted/20">
      <div className="text-center space-y-2">
        <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="font-medium text-muted-foreground">Recurso Premium</p>
        <p className="text-sm text-muted-foreground">
          {feature} está disponível apenas para usuários Premium
        </p>
        <Badge variant="outline" className="mt-2">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      </div>
    </div>
  )
}