# ✅ Checklist de Ativação da Monetização (AdSense + AdMob)

> Estado atual: **estrutura pronta, IDs como placeholder**.
> Enquanto o Publisher ID estiver como `REPLACE_ME_CA_PUB`, **nenhum anúncio web é carregado** (intencional, para não violar políticas do AdSense). No mobile, o AdMob roda em **modo de teste** automaticamente.

---

## 🌐 Web (Google AdSense)

### 1. Criar conta e obter o Publisher ID
- Acesse https://www.google.com/adsense → **Criar conta**
- Adicione o site (produção: `simuladorinvestimentos.lovable.app` ou seu domínio próprio)
- Aguarde aprovação (1-14 dias). Após aprovado, copie o **Publisher ID** (formato `ca-pub-XXXXXXXXXXXXXXXX`)

### 2. Criar Unidades de Anúncio
No painel AdSense → **Anúncios → Por unidade de anúncio**, crie:

| Nome sugerido     | Tipo                    | Onde será usado                         |
|-------------------|-------------------------|------------------------------------------|
| `simulador-banner`  | Display responsivo     | Topo do Dashboard e do Simulador        |
| `simulador-sidebar` | Display 300x250        | Sidebar do desktop                      |
| `simulador-native`  | In-feed (nativo)       | Entre seções (resultado / gráfico)      |
| `simulador-footer`  | Display responsivo     | Rodapé (opcional)                       |

Copie o **Slot ID** de cada um (sequência de dígitos).

### 3. Colar os IDs no projeto
Edite **`src/utils/adConfig.ts`**:

```ts
const ADSENSE_PUBLISHER_ID = 'ca-pub-1234567890123456' // ← seu Publisher ID

const ADSENSE_SLOTS = {
  banner:  '1111111111', // ← simulador-banner
  sidebar: '2222222222', // ← simulador-sidebar
  native:  '3333333333', // ← simulador-native
  footer:  '4444444444', // ← simulador-footer
}
```

Pronto. O script do AdSense é injetado automaticamente em runtime (`src/utils/loadAdSense.ts`) e os anúncios começam a aparecer para usuários **não-Premium**.

### 4. Pós-deploy
- No painel do AdSense, vincule o domínio publicado.
- Ative a categoria **Finanças** para CPMs mais altos.
- Aguarde 24-48h para o algoritmo otimizar.

---

## 📱 Mobile (Google AdMob via Capacitor)

> Necessário **apenas** se for publicar nas lojas (Play Store / App Store). No navegador, ignore esta seção.

### 1. Criar app no AdMob
- https://apps.admob.com → **Apps → Adicionar app**
- Crie um app para **Android** e outro para **iOS**
- Copie o **App ID** de cada um (formato `ca-app-pub-XXXXXX~XXXXXX`)

### 2. Criar Ad Units
Para cada app, crie:
- **Banner** (adaptativo, rodapé)
- **Intersticial** (exibido após salvar simulação)
- **Rewarded** (opcional — desbloquear features extras)

### 3. Colar os IDs no projeto
Edite **`src/utils/adConfig.ts`** → `ADMOB_PRODUCTION_IDS`:

```ts
const ADMOB_PRODUCTION_IDS = {
  android: {
    banner:       'ca-app-pub-XXXX/YYYY',
    interstitial: 'ca-app-pub-XXXX/YYYY',
    rewarded:     'ca-app-pub-XXXX/YYYY',
  },
  ios: {
    banner:       'ca-app-pub-XXXX/YYYY',
    interstitial: 'ca-app-pub-XXXX/YYYY',
    rewarded:     'ca-app-pub-XXXX/YYYY',
  },
}
```

O sistema detecta automaticamente: enquanto algum valor for `REPLACE_ME_*`, ele usa os **IDs de teste oficiais do Google** (`isTesting: true`).

### 4. Configurar App ID nativo
- **Android** → `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXX~YYYY"/>
  ```
- **iOS** → `ios/App/App/Info.plist`:
  ```xml
  <key>GADApplicationIdentifier</key>
  <string>ca-app-pub-XXXX~YYYY</string>
  ```

Depois rode: `npx cap sync`.

---

## 📍 Mapa atual de posicionamento

| Local                                | Componente                                 | Tipo                |
|--------------------------------------|--------------------------------------------|---------------------|
| Topo do Dashboard                    | `<AdBanner variant="top" />`               | Banner responsivo   |
| Entre métricas e gráficos (Dashboard)| `<AdBanner variant="inline" />`            | Nativo in-feed      |
| Topo do Simulador                    | `<AdBanner variant="top" />`               | Banner responsivo   |
| Entre métricas e gráfico (Simulador) | `<AdBanner variant="inline" />`            | Nativo in-feed      |
| Entre gráfico e resumo (Simulador)   | `<AdBanner variant="inline" />`            | Nativo in-feed      |
| Sidebar (desktop)                    | `<AdBanner variant="sidebar" />`           | Retângulo 300x250   |
| Mobile, após simular                 | `useInterstitialAd().showAdAfterSimulation()` | Intersticial AdMob |

Todos respeitam `useAdVisibility()` — **usuários Premium nunca veem anúncios**.

---

## 🔒 Garantias de segurança / política

- ✅ Nenhum slot vazio é renderizado enquanto IDs forem placeholder
- ✅ Script do AdSense só é injetado quando Publisher ID válido
- ✅ AdMob roda em modo `isTesting: true` até IDs reais serem definidos
- ✅ Premium (Stripe) bloqueia 100% dos anúncios
- ⚠️ **Nunca clique nos próprios anúncios em produção** — causa banimento permanente

---

## 🧪 Como testar localmente

1. Em `adConfig.ts`, troque `ADSENSE_PUBLISHER_ID` por um valor de teste do Google: `ca-pub-3940256099942544`
2. Use slots `1234567890`
3. Os anúncios aparecerão como blocos de teste do AdSense (sem receita)
4. **Antes de publicar**, volte para seus IDs reais.
