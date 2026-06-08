/**
 * ============================================================
 * CONFIGURAÇÃO CENTRALIZADA DE ANÚNCIOS
 * ============================================================
 *
 * 👉 Para ativar a monetização REAL, substitua os valores marcados
 *    com "REPLACE_ME" pelos seus IDs do Google AdSense / AdMob.
 *
 * Enquanto os valores forem "REPLACE_ME", nenhum anúncio será
 * carregado (evita erros no console e violação de políticas do
 * AdSense por exibir slots vazios).
 *
 * Veja o passo a passo em: CHECKLIST_MONETIZACAO.md
 * ============================================================
 */

// ---------- Google AdSense (Web) ----------
const ADSENSE_PUBLISHER_ID = 'ca-pub-1263564821286429'

const ADSENSE_SLOTS = {
  banner:  '6020809553',               // ✅ Slot ativo (banner topo Dashboard / Simulador)
  sidebar: 'REPLACE_ME_SLOT_SIDEBAR',  // Crie no AdSense (300x250) e cole aqui
  native:  'REPLACE_ME_SLOT_NATIVE',   // Crie no AdSense (in-feed) e cole aqui
  footer:  'REPLACE_ME_SLOT_FOOTER',   // Crie no AdSense (responsivo rodapé) e cole aqui
}

// ---------- Google AdMob (Capacitor / Mobile) ----------
// IDs de TESTE oficiais do Google. Não geram receita, mas evitam
// banimento durante o desenvolvimento. Troque pelos IDs reais antes
// de publicar na Play Store / App Store.
const ADMOB_TEST_IDS = {
  android: {
    banner:       'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded:     'ca-app-pub-3940256099942544/5224354917',
  },
  ios: {
    banner:       'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded:     'ca-app-pub-3940256099942544/1712485313',
  },
}

const ADMOB_PRODUCTION_IDS = {
  android: {
    banner:       'REPLACE_ME_ADMOB_ANDROID_BANNER',
    interstitial: 'REPLACE_ME_ADMOB_ANDROID_INTERSTITIAL',
    rewarded:     'REPLACE_ME_ADMOB_ANDROID_REWARDED',
  },
  ios: {
    banner:       'REPLACE_ME_ADMOB_IOS_BANNER',
    interstitial: 'REPLACE_ME_ADMOB_IOS_INTERSTITIAL',
    rewarded:     'REPLACE_ME_ADMOB_IOS_REWARDED',
  },
}

// ---------- Helpers ----------

/** Detecta se um valor ainda é um placeholder REPLACE_ME_*. */
const isPlaceholder = (value: string) => value.startsWith('REPLACE_ME')

/** AdSense só carrega se o Publisher ID estiver configurado. */
export const isAdSenseConfigured = (): boolean =>
  !isPlaceholder(ADSENSE_PUBLISHER_ID) && ADSENSE_PUBLISHER_ID.startsWith('ca-pub-')

/** AdMob produção só roda se TODOS os IDs da plataforma estiverem preenchidos. */
export const isAdMobProductionConfigured = (platform: 'android' | 'ios'): boolean =>
  Object.values(ADMOB_PRODUCTION_IDS[platform]).every((id) => !isPlaceholder(id))

export const getAdSensePublisherId = (): string => ADSENSE_PUBLISHER_ID

export const getAdSenseSlot = (slot: keyof typeof ADSENSE_SLOTS): string => ADSENSE_SLOTS[slot]

export const getAdMobId = (
  type: 'banner' | 'interstitial' | 'rewarded',
  platform: 'android' | 'ios',
): string => {
  // Usa IDs reais quando estiverem configurados, senão volta para os IDs de teste.
  if (isAdMobProductionConfigured(platform)) {
    return ADMOB_PRODUCTION_IDS[platform][type]
  }
  return ADMOB_TEST_IDS[platform][type]
}

/** Indica se devemos rodar AdMob em modo de teste (não gera receita). */
export const isAdMobTestMode = (platform: 'android' | 'ios'): boolean =>
  !isAdMobProductionConfigured(platform)

export const adConfig = {
  settings: {
    refreshInterval: 30_000, // 30s
    maxRetries: 3,
    /** Intervalo mínimo entre intersticiais (ms). 3 min é o recomendado pelo Google. */
    interstitialMinInterval: 180_000,
  },
}
