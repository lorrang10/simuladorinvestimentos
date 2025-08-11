import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
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
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { signOut } = useAuth()
  const { profile, isPremium } = useUserProfile()
  const navigate = useNavigate()

  const handleNavigateToSettings = () => {
    navigate('/configuracoes')
  }

  const handleNavigateToSubscriptions = () => {
    navigate('/assinaturas')
  }
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
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
            <DropdownMenuItem onClick={handleNavigateToSettings}>Configurações</DropdownMenuItem>
            <DropdownMenuItem onClick={handleNavigateToSubscriptions}>
              Planos & Assinatura
              <span className="ml-auto text-xs text-muted-foreground">
                {isPremium ? 'Premium' : 'Free'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger" onClick={signOut}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}