import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvestmentRate {
  type: string
  rate: number
  lastUpdated: string
}

interface BancoCentralData {
  '@odata.context': string
  value: Array<{
    DataReferencia: string
    ValorMeta: number
  }>
}

// Cache para armazenar as taxas por 24 horas
let cachedRates: Record<string, InvestmentRate> | null = null
let lastFetchTime: number = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas em millisegundos

// Fallback rates caso a API falhe (referência: Selic 15% a.a., CDI ~14.9% a.a., IPCA ~4.5% a.a.)
const FALLBACK_SELIC = 0.15
const FALLBACK_CDI = 0.149
const FALLBACK_IPCA = 0.045

const buildFallback = (): Record<string, InvestmentRate> => {
  const now = new Date().toISOString()
  const selic = FALLBACK_SELIC
  const cdi = FALLBACK_CDI
  const ipca = FALLBACK_IPCA
  return {
    'selic':        { type: 'Selic',           rate: selic,            lastUpdated: now },
    'cdi':          { type: 'CDI',             rate: cdi,              lastUpdated: now },
    'ipca':         { type: 'IPCA',            rate: ipca,             lastUpdated: now },
    'tesouro-direto':{ type: 'Tesouro Direto', rate: selic + 0.005,    lastUpdated: now },
    'cdb':          { type: 'CDB',             rate: cdi * 1.05,       lastUpdated: now },
    'lci':          { type: 'LCI',             rate: cdi * 0.90,       lastUpdated: now },
    'lca':          { type: 'LCA',             rate: cdi * 0.92,       lastUpdated: now },
    'debentures':   { type: 'Debêntures',      rate: selic + 0.02,     lastUpdated: now },
    'letras-cambio':{ type: 'Letras de Câmbio',rate: cdi * 1.00,       lastUpdated: now },
    // Renda Variável - médias históricas reais de longo prazo (Ibovespa ~14% a.a., IFIX ~13% a.a.)
    'acoes':        { type: 'Ações',           rate: 0.14,             lastUpdated: now },
    'etfs':         { type: 'ETFs',            rate: 0.13,             lastUpdated: now },
    'fiis':         { type: 'FIIs',            rate: 0.13,             lastUpdated: now },
  }
}

const fallbackRates: Record<string, InvestmentRate> = buildFallback()

async function fetchSelicRate(): Promise<number> {
  try {
    // API do Banco Central para taxa Selic (meta)
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && Array.isArray(data) && data.length > 0) {
      // Pega a taxa mais recente e converte corretamente
      const latestRate = data[0]
      const rateValue = parseFloat(latestRate.valor) / 100 // API retorna em %
      console.log(`Selic rate from API: ${latestRate.valor}% -> ${rateValue}`)
      return rateValue
    }
    
    throw new Error('No data received from Banco Central')
  } catch (error) {
    console.error('Error fetching Selic rate from Banco Central:', error)
    return 0.1175 // Fallback para 11.75%
  }
}

async function fetchCDIRate(): Promise<number> {
  try {
    // API do Banco Central para taxa CDI (série 12)
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json'
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && Array.isArray(data) && data.length > 0) {
      // Pega a taxa mais recente e converte corretamente
      const latestRate = data[0]
      const rateValue = Math.pow(1 + (parseFloat(latestRate.valor) / 100), 252) - 1 // Anualiza a taxa diária (considerando 252 dias úteis)
      console.log(`CDI rate from API: ${latestRate.valor}% (diário) -> ${(rateValue * 100).toFixed(2)}% (anual)`)
      return rateValue
    }
    
    throw new Error('No CDI data received')
  } catch (error) {
    console.error('Error fetching CDI rate:', error)
    return FALLBACK_CDI
  }
}

async function fetchIPCARate(): Promise<number> {
  try {
    // Série 433 = IPCA mensal. Pegamos os últimos 12 meses e acumulamos.
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json'
    )
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    if (Array.isArray(data) && data.length === 12) {
      const accumulated = data.reduce((acc: number, item: any) => {
        return acc * (1 + parseFloat(item.valor) / 100)
      }, 1) - 1
      console.log(`IPCA acumulado 12m: ${(accumulated * 100).toFixed(2)}%`)
      return accumulated
    }
    throw new Error('No IPCA data')
  } catch (error) {
    console.error('Error fetching IPCA rate:', error)
    return FALLBACK_IPCA
  }
}

async function fetchRealRates(): Promise<Record<string, InvestmentRate>> {
  const now = Date.now()
  
  // Verifica se o cache ainda é válido
  if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Using cached rates')
    return cachedRates
  }
  
    try {
    console.log('Fetching fresh investment rates from Banco Central...')
    
    // Busca taxas reais em paralelo
    const [selicRate, cdiRate] = await Promise.all([
      fetchSelicRate(),
      fetchCDIRate()
    ])
    
    console.log(`Selic rate: ${(selicRate * 100).toFixed(2)}%`)
    console.log(`CDI rate: ${(cdiRate * 100).toFixed(2)}%`)
    
    // Valida se as taxas estão em uma faixa razoável (entre 0.5% e 25%)
    const isValidRate = (rate: number) => rate >= 0.005 && rate <= 0.25
    
    const validSelicRate = isValidRate(selicRate) ? selicRate : 0.1175
    const validCdiRate = isValidRate(cdiRate) ? cdiRate : 0.1150
    
    if (!isValidRate(selicRate)) {
      console.warn(`Invalid Selic rate ${selicRate}, using fallback`)
    }
    if (!isValidRate(cdiRate)) {
      console.warn(`Invalid CDI rate ${cdiRate}, using fallback`)
    }
    
    // Calcula taxas baseadas nas referências reais e validadas
    const updatedRates: Record<string, InvestmentRate> = {
      'tesouro-direto': {
        type: 'Tesouro Direto',
        rate: validSelicRate + 0.005, // Selic + 0.5% spread
        lastUpdated: new Date().toISOString()
      },
      'cdb': {
        type: 'CDB',
        rate: validCdiRate * 1.05, // 105% do CDI
        lastUpdated: new Date().toISOString()
      },
      'lci': {
        type: 'LCI',
        rate: validCdiRate * 0.88, // 88% do CDI (isento de IR)
        lastUpdated: new Date().toISOString()
      },
      'lca': {
        type: 'LCA',
        rate: validCdiRate * 0.90, // 90% do CDI (isento de IR)
        lastUpdated: new Date().toISOString()
      },
      'debentures': {
        type: 'Debêntures',
        rate: validSelicRate + 0.02, // Selic + 2% spread
        lastUpdated: new Date().toISOString()
      },
      'letras-cambio': {
        type: 'Letras de Câmbio',
        rate: validCdiRate * 1.00, // 100% do CDI
        lastUpdated: new Date().toISOString()
      },
      // Renda Variável - baseada em histórico e CDI + risco (ajustado para perfil conservador)
      'acoes': {
        type: 'Ações',
        rate: validCdiRate + 0.03, // CDI + 3% (mais conservador para ações)
        lastUpdated: new Date().toISOString()
      },
      'etfs': {
        type: 'ETFs',
        rate: validCdiRate + 0.015, // CDI + 1.5% (mais conservador para ETFs)
        lastUpdated: new Date().toISOString()
      },
      'fiis': {
        type: 'FIIs',
        rate: validCdiRate + 0.01, // CDI + 1% (mais conservador para FIIs)
        lastUpdated: new Date().toISOString()
      }
    }
    
    // Log das taxas finais para debug
    Object.entries(updatedRates).forEach(([key, rate]) => {
      console.log(`${rate.type}: ${(rate.rate * 100).toFixed(2)}%`)
    })
    
    // Atualiza o cache
    cachedRates = updatedRates
    lastFetchTime = now
    
    console.log('Successfully updated investment rates with real data')
    return updatedRates
    
  } catch (error) {
    console.error('Error fetching real rates:', error)
    
    // Se temos cache antigo, usa ele
    if (cachedRates) {
      console.log('Using stale cached rates due to fetch error')
      return cachedRates
    }
    
    // Caso contrário, usa fallback
    console.log('Using fallback rates')
    return fallbackRates
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    let body = {}
    
    // Tenta fazer parse do body, mas não falha se estiver vazio
    try {
      const text = await req.text()
      if (text) {
        body = JSON.parse(text)
      }
    } catch (parseError) {
      console.log('No valid JSON body provided, using empty object')
    }
    
    const { investmentType } = body as { investmentType?: string }
    
    console.log('Getting rates for investment type:', investmentType || 'all')
    
    const rates = await fetchRealRates()
    
    if (investmentType) {
      const specificRate = rates[investmentType]
      if (!specificRate) {
        return new Response(
          JSON.stringify({ error: 'Investment type not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      return new Response(
        JSON.stringify({ rate: specificRate }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Retorna todas as taxas se nenhum tipo específico foi solicitado
    return new Response(
      JSON.stringify({ 
        rates,
        lastUpdated: new Date().toISOString(),
        source: 'Banco Central do Brasil'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error processing request:', error)
    
    // Em caso de erro, retorna taxas fallback
    return new Response(
      JSON.stringify({ 
        rates: fallbackRates,
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
        error: 'Unable to fetch real rates, using fallback data'
      }),
      { 
        status: 200, // Retorna 200 para não quebrar o frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
