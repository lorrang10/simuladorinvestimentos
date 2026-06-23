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
    const [selicRate, cdiRate, ipcaRate] = await Promise.all([
      fetchSelicRate(),
      fetchCDIRate(),
      fetchIPCARate(),
    ])

    console.log(`Selic: ${(selicRate*100).toFixed(2)}% | CDI: ${(cdiRate*100).toFixed(2)}% | IPCA 12m: ${(ipcaRate*100).toFixed(2)}%`)

    // Validação de faixa razoável
    const inRange = (v: number, min: number, max: number) => v >= min && v <= max
    const validSelic = inRange(selicRate, 0.02, 0.30) ? selicRate : FALLBACK_SELIC
    const validCdi   = inRange(cdiRate,   0.02, 0.30) ? cdiRate   : FALLBACK_CDI
    const validIpca  = inRange(ipcaRate, -0.05, 0.30) ? ipcaRate  : FALLBACK_IPCA

    const ts = new Date().toISOString()
    const updatedRates: Record<string, InvestmentRate> = {
      // Índices base (necessários para "% do CDI / Selic / IPCA+")
      'selic':         { type: 'Selic',            rate: validSelic,         lastUpdated: ts },
      'cdi':           { type: 'CDI',              rate: validCdi,           lastUpdated: ts },
      'ipca':          { type: 'IPCA',             rate: validIpca,          lastUpdated: ts },
      // Renda Fixa (taxas BRUTAS - IR aplicado no cliente conforme o produto)
      'tesouro-direto':{ type: 'Tesouro Direto',   rate: validSelic + 0.005, lastUpdated: ts }, // Selic + 0,5%
      'cdb':           { type: 'CDB',              rate: validCdi * 1.05,    lastUpdated: ts }, // 105% CDI
      'lci':           { type: 'LCI',              rate: validCdi * 0.90,    lastUpdated: ts }, // 90% CDI (isento IR)
      'lca':           { type: 'LCA',              rate: validCdi * 0.92,    lastUpdated: ts }, // 92% CDI (isento IR)
      'debentures':    { type: 'Debêntures',       rate: validSelic + 0.02,  lastUpdated: ts }, // Selic + 2%
      'letras-cambio': { type: 'Letras de Câmbio', rate: validCdi * 1.00,    lastUpdated: ts }, // 100% CDI
      // Renda Variável - médias históricas reais nominais de longo prazo
      'acoes':         { type: 'Ações',            rate: 0.14,               lastUpdated: ts }, // Ibovespa histórico ~14% a.a.
      'etfs':          { type: 'ETFs',             rate: 0.13,               lastUpdated: ts },
      'fiis':          { type: 'FIIs',             rate: 0.13,               lastUpdated: ts }, // IFIX histórico ~13% a.a.
    }

    Object.entries(updatedRates).forEach(([key, r]) => {
      console.log(`${key}: ${(r.rate * 100).toFixed(2)}%`)
    })

    cachedRates = updatedRates
    lastFetchTime = now
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
