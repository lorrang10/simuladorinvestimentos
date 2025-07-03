import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para o banco de dados
export interface User {
  id: string
  email: string
  created_at: string
}

export interface InvestmentSimulation {
  id: string
  user_id: string
  nome: string
  valor_inicial: number
  valor_mensal: number
  taxa_juros: number
  periodo_anos: number
  valor_final: number
  rendimento_total: number
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  nome_completo?: string
  telefone?: string
  data_nascimento?: string
  objetivo_investimento?: string
  perfil_risco?: 'conservador' | 'moderado' | 'arrojado'
  created_at: string
  updated_at: string
}