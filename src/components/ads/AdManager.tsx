import { useAdPlatform } from '@/hooks/useAdPlatform'
import { useAdVisibility } from '@/hooks/useAdVisibility'
import { AdSenseComponent } from './AdSenseComponent'
import { AdMobComponent } from './AdMobComponent'
import { Skeleton } from '@/components/ui/skeleton'

interface AdManagerProps {
  // Configurações de anúncio
  slot?: 'banner' | 'sidebar' | 'native' | 'footer'
  type?: 'banner' | 'interstitial' | 'rewarded'
  position?: 'top' | 'bottom'
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  
  // Layout e estilo
  className?: string
  style?: React.CSSProperties
  
  // Callbacks
  onAdLoaded?: () => void
  onAdFailedToLoad?: (error: any) => void
}

export function AdManager({
  slot = 'banner',
  type = 'banner',
  position = 'bottom',
  format = 'auto',
  className = '',
  style,
  onAdLoaded,
  onAdFailedToLoad
}: AdManagerProps) {
  const { platform, isReady } = useAdPlatform()
  const { shouldShowAds } = useAdVisibility()

  // Não mostrar anúncios para usuários premium
  if (!shouldShowAds) {
    return null
  }

  // Mostrar skeleton enquanto detecta a plataforma
  if (!isReady) {
    return (
      <div className={className} style={style}>
        <Skeleton className="h-16 w-full rounded-md" />
        <div className="text-xs text-muted-foreground text-center mt-1">
          Carregando...
        </div>
      </div>
    )
  }

  // Renderizar componente apropriado baseado na plataforma
  if (platform === 'web') {
    return (
      <AdSenseComponent
        slot={slot}
        format={format}
        className={className}
        style={style}
      />
    )
  }

  if (platform === 'mobile') {
    return (
      <AdMobComponent
        type={type}
        position={position}
        className={className}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    )
  }

  return null
}