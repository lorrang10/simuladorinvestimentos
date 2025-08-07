import { NavLink, useLocation } from "react-router-dom"
import { BarChart, Home, FolderOpen, Settings, HelpCircle, LogOut, User, Crown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, premium: true },
  { title: "Simular Investimento", url: "/simular", icon: BarChart, premium: false },
  { title: "Meus Investimentos", url: "/historico", icon: FolderOpen, premium: true },
]

const bottomItems = [
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Assinaturas", url: "/assinaturas", icon: Crown },
  { title: "Ajuda", url: "/ajuda", icon: HelpCircle },
]

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar()
  const { user, signOut } = useAuth()
  const { isPremium } = useUserProfile()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"
  const isMobile = useIsMobile()

  // Fecha o sidebar automaticamente ao navegar em mobile
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [currentPath, isMobile, setOpenMobile])

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <BarChart className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-primary-foreground">InvestSmart</h1>
              <p className="text-xs text-sidebar-foreground/60">Simulador Pro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium">
            {!collapsed && "NAVEGAÇÃO"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.premium && !isPremium ? "#" : item.url} 
                      end 
                      className={({ isActive }) => {
                        const baseClasses = getNavCls({ isActive });
                        if (item.premium && !isPremium) {
                          return `${baseClasses} opacity-50 cursor-not-allowed`;
                        }
                        return baseClasses;
                      }}
                      onClick={(e) => {
                        if (item.premium && !isPremium) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.title}</span>
                          {item.premium && !isPremium && (
                            <Crown className="h-3 w-3 text-primary" />
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        {user && !collapsed && (
          <div className="flex items-center gap-2 px-2 py-1 text-xs text-sidebar-foreground/60">
            <User className="h-3 w-3" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={signOut}
              className="text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}