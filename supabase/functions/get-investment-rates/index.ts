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

// Fallback rates caso a API falhe
const fallbackRates: Record<string, InvestmentRate> = {
  'tesouro-direto': {
    type: 'Tesouro Direto',
    rate: 0.1175,
    lastUpdated: new Date().toISOString()
  },
  'cdb': {
    type: 'CDB',
    rate: 0.1250,
    lastUpdated: new Date().toISOString()
  },
  'lci': {
    type: 'LCI',
    rate: 0.1050,
    lastUpdated: new Date().toISOString()
  },
  'lca': {
    type: 'LCA',
    rate: 0.1075,
    lastUpdated: new Date().toISOString()
  },
  'debentures': {
    type: 'Debêntures',
    rate: 0.1350,
    lastUpdated: new Date().toISOString()
  },
  'letras-cambio': {
    type: 'Letras de Câmbio',
    rate: 0.1200,
    lastUpdated: new Date().toISOString()
  },
  // Renda Variável - retornos históricos médios anualizados
  'acoes': {
    type: 'Ações',
    rate: 0.12,
    lastUpdated: new Date().toISOString()
  },
  'etfs': {
    type: 'ETFs',
    rate: 0.10,
    lastUpdated: new Date().toISOString()
  },
  'fiis': {
    type: 'FIIs',
    rate: 0.08,
    lastUpdated: new Date().toISOString()
  }
}

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
      const rateValue = parseFloat(latestRate.valor) / 100 // API retorna em %
      console.log(`CDI rate from API: ${latestRate.valor}% -> ${rateValue}`)
      return rateValue
    }
    
    throw new Error('No CDI data received')
  } catch (error) {
    console.error('Error fetching CDI rate:', error)
    return 0.1150 // Fallback próximo à Selic
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
      // Renda Variável - baseada em histórico e CDI + risco
      'acoes': {
        type: 'Ações',
        rate: validCdiRate + 0.05, // CDI + 5% (retorno histórico Ibovespa)
        lastUpdated: new Date().toISOString()
      },
      'etfs': {
        type: 'ETFs',
        rate: validCdiRate + 0.03, // CDI + 3% (mais conservador que ações)
        lastUpdated: new Date().toISOString()
      },
      'fiis': {
        type: 'FIIs',
        rate: validCdiRate + 0.02, // CDI + 2% (distribuição de dividendos)
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