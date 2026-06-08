import { getAdSensePublisherId, isAdSenseConfigured } from './adConfig'

/**
 * Injeta o script do Google AdSense dinamicamente APENAS quando o
 * Publisher ID estiver configurado. Isso evita:
 *   - Erros 400 no console com IDs placeholder
 *   - Violação de política do AdSense por carregar o script sem ID válido
 *   - Carregar o script no app nativo Capacitor (onde se usa AdMob)
 */
let injected = false

export function loadAdSenseScript(): void {
  if (injected) return
  if (typeof window === 'undefined') return
  if (!isAdSenseConfigured()) {
    // Silencioso em produção. Útil só durante o setup.
    if (import.meta.env.DEV) {
      console.info('[AdSense] Publisher ID não configurado — script não foi carregado.')
    }
    return
  }

  const publisherId = getAdSensePublisherId()
  const script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
  document.head.appendChild(script)

  // Inicializa o array global usado pelo AdSense.
  ;(window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
    (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []

  injected = true
}
