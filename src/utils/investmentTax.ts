/**
 * Cálculo de Imposto de Renda sobre investimentos no Brasil.
 *
 * Renda Fixa tributável (Tesouro, CDB, Debêntures não-incentivadas, Letras de Câmbio):
 *   Tabela regressiva sobre o LUCRO:
 *     - até 180 dias:   22,5%
 *     - 181 a 360 dias: 20,0%
 *     - 361 a 720 dias: 17,5%
 *     - acima de 720d:  15,0%
 *
 * Isentos de IR para PF:
 *   - LCI, LCA, Debêntures incentivadas, Poupança
 *   - FIIs (rendimentos mensais; ganho de capital tributado, mas não modelado aqui)
 *
 * Renda Variável (Ações, ETFs de ações):
 *   - 15% sobre o GANHO de capital (vendas comuns).
 *     Simplificação: aplica-se ao lucro total da simulação (longo prazo).
 */

export type TaxRegime = 'renda-fixa-regressiva' | 'isento' | 'rv-15'

const TAX_BY_TYPE: Record<string, TaxRegime> = {
  'tesouro-direto': 'renda-fixa-regressiva',
  'cdb':            'renda-fixa-regressiva',
  'debentures':     'renda-fixa-regressiva',
  'letras-cambio':  'renda-fixa-regressiva',
  'lci':            'isento',
  'lca':            'isento',
  'fiis':           'isento', // rendimentos mensais isentos para PF
  'acoes':          'rv-15',
  'etfs':           'rv-15',
}

export function getTaxRegime(investmentType: string): TaxRegime {
  return TAX_BY_TYPE[investmentType] ?? 'renda-fixa-regressiva'
}

/** Alíquota da tabela regressiva da renda fixa em função do prazo em dias. */
export function regressiveRate(totalDays: number): number {
  if (totalDays <= 180) return 0.225
  if (totalDays <= 360) return 0.20
  if (totalDays <= 720) return 0.175
  return 0.15
}

export interface TaxResult {
  taxRate: number      // alíquota efetiva aplicada (0..1)
  taxAmount: number    // imposto em R$
  netProfit: number    // lucro líquido
  netFinalValue: number// valor final líquido (principal + lucro líquido)
  exempt: boolean
}

/**
 * Calcula o IR considerando o tipo de produto, lucro bruto e prazo (meses).
 * @param investmentType chave do investimento ('cdb', 'lci', 'acoes', etc.)
 * @param grossProfit lucro bruto em R$ (>= 0)
 * @param totalInvested valor total aportado em R$
 * @param totalMonths prazo total em meses
 */
export function calculateTax(
  investmentType: string,
  grossProfit: number,
  totalInvested: number,
  totalMonths: number,
): TaxResult {
  const regime = getTaxRegime(investmentType)
  const profit = Math.max(0, grossProfit)
  const days = Math.round(totalMonths * 30)
  let taxRate = 0

  if (regime === 'renda-fixa-regressiva') taxRate = regressiveRate(days)
  else if (regime === 'rv-15') taxRate = 0.15
  // isento => 0

  const taxAmount = profit * taxRate
  const netProfit = grossProfit - taxAmount
  const netFinalValue = totalInvested + netProfit

  return {
    taxRate,
    taxAmount,
    netProfit,
    netFinalValue,
    exempt: regime === 'isento',
  }
}
