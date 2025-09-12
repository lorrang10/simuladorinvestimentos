import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

export type AdPlatform = 'web' | 'mobile'

export function useAdPlatform() {
  const [platform, setPlatform] = useState<AdPlatform>('web')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const detectPlatform = () => {
      // Detecta se está rodando como app nativo via Capacitor
      if (Capacitor.isNativePlatform()) {
        setPlatform('mobile')
      } else {
        setPlatform('web')
      }
      setIsReady(true)
    }

    detectPlatform()
  }, [])

  return {
    platform,
    isWeb: platform === 'web',
    isMobile: platform === 'mobile',
    isReady
  }
}