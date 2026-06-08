import { useEffect, useRef } from 'react'
import { getAdSenseSlot, getAdSensePublisherId, isAdSenseConfigured } from '@/utils/adConfig'
import { loadAdSenseScript } from '@/utils/loadAdSense'

interface AdSenseComponentProps {
  slot?: 'banner' | 'sidebar' | 'native' | 'footer'
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  style?: React.CSSProperties
  className?: string
}

export function AdSenseComponent({
  slot = 'banner',
  format = 'auto',
  style,
  className = '',
}: AdSenseComponentProps) {
  const adRef = useRef<HTMLModElement>(null)
  const adSlot = getAdSenseSlot(slot)
  const publisherId = getAdSensePublisherId()

  useEffect(() => {
    if (!isAdSenseConfigured()) return
    loadAdSenseScript()

    try {
      if (adRef.current) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      // AdSense ainda carregando — não é crítico.
      if (import.meta.env.DEV) console.debug('AdSense push falhou:', error)
    }
  }, [])

  // Não renderiza nada enquanto o Publisher ID for placeholder
  // (evita slots vazios e violação de políticas do AdSense).
  if (!isAdSenseConfigured()) return null

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <div className="text-xs text-muted-foreground text-center mt-1">
        Publicidade
      </div>
    </div>
  )
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}
