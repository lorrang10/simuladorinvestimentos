import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { getAdMobId } from '@/utils/adConfig'

interface AdMobComponentProps {
  type?: 'banner' | 'interstitial' | 'rewarded'
  position?: 'top' | 'bottom'
  className?: string
  onAdLoaded?: () => void
  onAdFailedToLoad?: (error: any) => void
}

// Interfaces para TypeScript - will be properly typed when AdMob is available
interface BannerAdOptions {
  adId: string
  adSize: any
  position: any
  margin: number
}

export function AdMobComponent({ 
  type = 'banner',
  position = 'bottom',
  className = '',
  onAdLoaded,
  onAdFailedToLoad
}: AdMobComponentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAdMobAd = async () => {
      try {
        // Verificar se estamos em um ambiente nativo
        if (!Capacitor.isNativePlatform()) {
          setError('AdMob apenas disponível em apps nativos')
          setIsLoading(false)
          return
        }

        // Importar dinamicamente o plugin AdMob
        const AdMobModule = await import('@capacitor-community/admob')
        const { AdMob, BannerAdSize, BannerAdPosition } = AdMobModule
        
        // Obter o ID correto baseado na plataforma
        const platform = Capacitor.getPlatform() as 'android' | 'ios'
        const adId = getAdMobId(type, platform)

        if (type === 'banner') {
          const options: BannerAdOptions = {
            adId,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
          }

          await AdMob.showBanner(options)
          setIsLoading(false)
          onAdLoaded?.()
        }

      } catch (error) {
        console.error('Erro ao carregar AdMob:', error)
        setError('Plugin AdMob não disponível')
        setIsLoading(false)
        onAdFailedToLoad?.(error)
      }
    }

    loadAdMobAd()

    // Cleanup
    return () => {
      if (Capacitor.isNativePlatform()) {
        import('@capacitor-community/admob').then((AdMobModule) => {
          AdMobModule.AdMob.hideBanner().catch(console.error)
        }).catch(console.error)
      }
    }
  }, [type, position, onAdLoaded, onAdFailedToLoad])

  if (error) {
    return null // Não mostrar nada em caso de erro
  }

  if (isLoading) {
    return (
      <div className={`ad-container-mobile ${className}`}>
        <div className="h-16 bg-muted animate-pulse rounded-md flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Carregando anúncio...</span>
        </div>
      </div>
    )
  }

  // Para banner ads no mobile, o AdMob renderiza nativamente
  // Este componente serve principalmente para controlar o estado
  return (
    <div className={`ad-container-mobile ${className}`}>
      <div className="text-xs text-muted-foreground text-center">
        Publicidade
      </div>
    </div>
  )
}