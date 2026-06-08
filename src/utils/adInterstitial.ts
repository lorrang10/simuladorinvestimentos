import { Capacitor } from '@capacitor/core'
import { adConfig, getAdMobId, isAdMobTestMode } from './adConfig'

// Gerenciador de anúncios intersticiais para mobile (AdMob via Capacitor)
export class InterstitialAdManager {
  private static instance: InterstitialAdManager
  private adLoaded = false
  private lastShown = 0
  private readonly MIN_INTERVAL = adConfig.settings.interstitialMinInterval

  private constructor() {}

  static getInstance(): InterstitialAdManager {
    if (!InterstitialAdManager.instance) {
      InterstitialAdManager.instance = new InterstitialAdManager()
    }
    return InterstitialAdManager.instance
  }

  async prepareAd(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return

    try {
      const AdMobModule = await import('@capacitor-community/admob')
      const { AdMob } = AdMobModule

      const platform = Capacitor.getPlatform() as 'android' | 'ios'
      const adId = getAdMobId('interstitial', platform)

      const options = {
        adId,
        // Modo de teste enquanto os IDs reais do AdMob não estiverem configurados.
        // Importante: nunca clique em anúncios reais para testar — viola políticas.
        isTesting: isAdMobTestMode(platform),
      }

      await AdMob.prepareInterstitial(options)
      this.adLoaded = true
      console.log('Interstitial ad prepared')
    } catch (error) {
      console.error('Error preparing interstitial ad:', error)
      this.adLoaded = false
    }
  }

  async showAd(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false
    
    const now = Date.now()
    if (now - this.lastShown < this.MIN_INTERVAL) {
      console.log('Too soon to show another ad')
      return false
    }

    if (!this.adLoaded) {
      console.log('Ad not loaded yet')
      return false
    }

    try {
      const AdMobModule = await import('@capacitor-community/admob')
      const { AdMob } = AdMobModule
      
      await AdMob.showInterstitial()
      this.lastShown = now
      this.adLoaded = false
      
      // Preparar próximo anúncio
      setTimeout(() => this.prepareAd(), 1000)
      
      return true
    } catch (error) {
      console.error('Error showing interstitial ad:', error)
      this.adLoaded = false
      return false
    }
  }

  // Mostrar anúncio após ação importante (ex: completar simulação)
  async showAfterAction(actionName: string): Promise<void> {
    console.log(`Action completed: ${actionName}`)
    const shown = await this.showAd()
    if (shown) {
      console.log(`Interstitial ad shown after ${actionName}`)
    }
  }
}

// Hook para usar em componentes React
export const useInterstitialAd = () => {
  const manager = InterstitialAdManager.getInstance()

  const showAdAfterSimulation = async () => {
    if (Capacitor.isNativePlatform()) {
      await manager.showAfterAction('simulation_completed')
    }
  }

  const prepareNextAd = async () => {
    if (Capacitor.isNativePlatform()) {
      await manager.prepareAd()
    }
  }

  return {
    showAdAfterSimulation,
    prepareNextAd,
  }
}
