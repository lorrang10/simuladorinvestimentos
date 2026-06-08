import { isAdSenseConfigured } from './adConfig'

/**
 * Inicializa o array global adsbygoogle usado pelo Google AdSense.
 * O script do AdSense já é carregado via <script> no index.html.
 * Esta função garante que o array existe antes de qualquer chamada
 * a (adsbygoogle = window.adsbygoogle || []).push({}).
 */
export function loadAdSenseScript(): void {
  if (typeof window === 'undefined') return
  if (!isAdSenseConfigured()) {
    if (import.meta.env.DEV) {
      console.info('[AdSense] Publisher ID não configurado — adsbygoogle não inicializado.')
    }
    return
  }

  // Inicializa o array global usado pelo AdSense.
  ;(window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
    (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []
}
