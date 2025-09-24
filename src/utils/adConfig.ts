// Configurações centralizadas para anúncios
export const adConfig = {
  // Google AdSense (Web)
  adsense: {
    publisherId: 'ca-pub-XXXXXXXXXX', // Substituir pelo seu Publisher ID
    slots: {
      banner: '1234567890',
      sidebar: '0987654321',
      native: '1122334455',
      footer: '6677889900'
    }
  },

  // Google AdMob (Mobile)
  admob: {
    // IDs de teste - substituir pelos IDs reais em produção
    android: {
      banner: 'ca-app-pub-3940256099942544/6300978111',
      interstitial: 'ca-app-pub-3940256099942544/1033173712',
      rewarded: 'ca-app-pub-3940256099942544/5224354917'
    },
    ios: {
      banner: 'ca-app-pub-3940256099942544/2934735716', 
      interstitial: 'ca-app-pub-3940256099942544/4411468910',
      rewarded: 'ca-app-pub-3940256099942544/1712485313'
    }
  },

  // Configurações gerais
  settings: {
    enableInDevelopment: false, // Habilitar anúncios em desenvolvimento
    refreshInterval: 30000, // 30 segundos
    maxRetries: 3
  }
}

export const getAdMobId = (type: 'banner' | 'interstitial' | 'rewarded', platform: 'android' | 'ios') => {
  return adConfig.admob[platform][type]
}

export const getAdSenseSlot = (type: 'banner' | 'sidebar' | 'native' | 'footer') => {
  return adConfig.adsense.slots[type]
}