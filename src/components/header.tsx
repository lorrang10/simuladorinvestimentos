import { Menu, Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useIsMobile } from "@/hooks/use-mobile"

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { signOut } = useAuth()
  const { profile, isPremium } = useUserProfile()
  const isMobile = useIsMobile()

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SidebarTrigger>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <div className="h-3 w-3 rounded-sm bg-primary-foreground" />
            </div>
            <h1 className="text-sm font-semibold">InvestSmart</h1>
          </div>
        ) : (
          title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-danger p-0 text-xs">
            3
          </Badge>
        </Button>

        {/* Perfil do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {profile?.nome_completo ? 
                    profile.nome_completo.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 
                    'U'
                  }
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">
                  {profile?.nome_completo || 'Usuário'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPremium ? 'Investidor Premium' : 'Investidor Free'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Minha Conta</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Planos & Assinatura</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger" onClick={signOut}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}