import { useEffect, useRef } from 'react'
import { getAdSenseSlot } from '@/utils/adConfig'

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
  className = ''
}: AdSenseComponentProps) {
  const adRef = useRef<HTMLModElement>(null)
  const adSlot = getAdSenseSlot(slot)

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        // Push do anúncio para o AdSense
        (window.adsbygoogle as any[]).push({})
      }
    } catch (error) {
      console.log('AdSense not loaded yet:', error)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXX" // Substituir pelo seu Publisher ID
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

// Declaração global para TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}