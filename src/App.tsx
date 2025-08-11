import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import SimularInvestimento from "./pages/SimularInvestimento";
import MeusInvestimentos from "./pages/MeusInvestimentos";
import Configuracoes from "./pages/Configuracoes";
import Assinaturas from "./pages/Assinaturas";
import Ajuda from "./pages/Ajuda";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProtectedRoute>
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={
                      <ProtectedRoute requiresPremium={true}>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/simular" element={<SimularInvestimento />} />
                    <Route path="/historico" element={
                      <ProtectedRoute requiresPremium={true}>
                        <MeusInvestimentos />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    <Route path="/assinaturas" element={<Assinaturas />} />
                    <Route path="/ajuda" element={<Ajuda />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
