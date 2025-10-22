# 🗺️ Mapa de Anúncios - Posicionamento Estratégico

## 📍 Localização dos Anúncios por Página

### **Dashboard (src/pages/Dashboard.tsx)**

```
┌─────────────────────────────────────────────┐
│  Header: "Olá, João!"                       │
├─────────────────────────────────────────────┤
│  🟨 BANNER TOP (linha ~156)                 │ ← AdSense Banner Responsivo
│  - Tipo: AdBanner variant="top"            │   eCPM: $3-6
│  - Visível apenas para free                │
├─────────────────────────────────────────────┤
│  📊 Métricas (4 cards)                      │
│  - Total Estimado                           │
│  - Simulações Salvas                        │
│  - Retorno Médio                            │
│  - Total Investido                          │
├─────────────────────────────────────────────┤
│  🟦 ANÚNCIO NATIVO (linha ~208)             │ ← AdSense Nativo (in-feed)
│  - Tipo: AdBanner variant="inline"         │   eCPM: $4-8
│  - Com hint de upgrade premium             │   CTR Alto!
├─────────────────────────────────────────────┤
│  📈 Gráfico Evolução | 📝 Simulações        │
│                      |    Recentes          │
├─────────────────────────────────────────────┤
│  💡 Dicas Inteligentes                      │
└─────────────────────────────────────────────┘
```

---

### **Simulador de Investimento (src/pages/SimularInvestimento.tsx)**

```
┌─────────────────────────────────────────────┐
│  Header: "Simular Investimento"             │
├─────────────────────────────────────────────┤
│  🟨 BANNER TOP (linha ~291)                 │ ← AdSense Banner Responsivo
│  - Tipo: AdBanner variant="top"            │   eCPM: $3-6
│  - Primeira coisa que o usuário vê         │
├─────────────────────────────────────────────┤
│  📋 Formulário de Simulação                 │
│  - Nome da simulação                        │
│  - Categoria e Tipo                         │
│  - Valores e período                        │
│  [BOTÃO SIMULAR] ← ao clicar...            │
├─────────────────────────────────────────────┤
│  📊 RESULTADOS DA SIMULAÇÃO                 │
│  ┌───────────────────────────────────────┐ │
│  │ 4 Cards de Métricas                   │ │
│  │ - Valor Final                         │ │
│  │ - Lucro Obtido                        │ │
│  │ - Total Investido                     │ │
│  │ - Taxa de Retorno                     │ │
│  └───────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  🟦 ANÚNCIO NATIVO (linha ~618)             │ ← AdSense Nativo (in-feed)
│  - Tipo: AdBanner variant="inline"         │   eCPM: $4-8
│  - Entre métricas e gráfico                │   Posição Premium!
├─────────────────────────────────────────────┤
│  📈 Gráfico: Evolução do Investimento       │
├─────────────────────────────────────────────┤
│  🟦 ANÚNCIO NATIVO (linha ~636)             │ ← AdSense Nativo (in-feed)
│  - Tipo: AdBanner variant="inline"         │   eCPM: $4-8
│  - Entre gráfico e resumo                  │
├─────────────────────────────────────────────┤
│  📄 Resumo da Simulação                     │
│  [BOTÃO: Salvar Simulação]                 │
└─────────────────────────────────────────────┘

🔴 MOBILE: Após clicar em "Simular"
   → Intersticial AdMob (linha ~227)
   → eCPM: $8-15 (MAIOR ROI!)
   → Intervalo mínimo: 3 minutos
```

---

### **Sidebar (src/components/app-sidebar.tsx)**

```
┌──────────────────┐
│  📱 InvestSmart  │
│  Simulador Pro   │
├──────────────────┤
│  🏠 Dashboard    │
│  📊 Simular      │
│  📁 Investimentos│
├──────────────────┤
│  🟧 BANNER       │ ← AdSense Sidebar
│  🟧 SIDEBAR      │   eCPM: $2-4
│  (linha ~109)    │   Apenas Desktop
│  - Formato rect │   Sempre visível
├──────────────────┤
│  ⚙️ Configurações│
│  👑 Assinaturas  │
│  ❓ Ajuda        │
├──────────────────┤
│  👤 user@mail    │
│  🚪 Sair         │
└──────────────────┘
```

---

## 🎯 Estratégia por Plataforma

### **WEB (Google AdSense)**

| Posição | Tipo | eCPM | Prioridade | Implementação |
|---------|------|------|------------|---------------|
| Dashboard Top | Banner Responsivo | $3-6 | Alta | Dashboard.tsx:156 |
| Simulador Top | Banner Responsivo | $3-6 | Alta | SimularInvestimento.tsx:291 |
| Entre Métricas | Nativo (in-feed) | $4-8 | Muito Alta | SimularInvestimento.tsx:618 |
| Dashboard Middle | Nativo (in-feed) | $4-8 | Muito Alta | Dashboard.tsx:208 |
| Entre Seções | Nativo (in-feed) | $4-8 | Alta | SimularInvestimento.tsx:636 |
| Sidebar | Banner Lateral | $2-4 | Média | app-sidebar.tsx:109 |

**Total estimado (1000 usuários/mês)**: $35-60

---

### **MOBILE (Google AdMob)**

| Posição | Tipo | eCPM | Prioridade | Implementação |
|---------|------|------|------------|---------------|
| Após Simulação | Intersticial | $8-15 | **Máxima** | SimularInvestimento.tsx:227 + adInterstitial.ts |
| Rodapé | Banner Adaptativo | $1-3 | Média | AdMobComponent.tsx (automático) |

**Total estimado (1000 usuários/mês)**: $18-32

---

## 🔧 Controle de Exibição

### **Lógica de Premium (useAdVisibility.ts)**

```typescript
const { shouldShowAds } = useAdVisibility()

// Anúncios são exibidos APENAS se:
✅ Usuário NÃO tem assinatura Stripe Premium
✅ Perfil do usuário NÃO está marcado como Premium

// Anúncios são OCULTADOS se:
❌ Usuário tem assinatura ativa no Stripe
❌ Perfil tem flag isPremium=true
```

### **Detecção de Plataforma (useAdPlatform.ts)**

```typescript
const { platform } = useAdPlatform()

// Web (navegador): AdSense
if (platform === 'web') {
  → Banners e anúncios nativos
  → Script no index.html
}

// Mobile (Android/iOS): AdMob  
if (platform === 'mobile') {
  → Intersticiais de alto valor
  → Banners adaptativos
  → Plugin @capacitor-community/admob
}
```

---

## 📊 Tracking de Performance

### **Eventos a Monitorar**

1. **Impressões de Anúncios**
   - Por página
   - Por tipo de anúncio
   - Por dispositivo

2. **CTR (Click-Through Rate)**
   - Meta: 1-3% para banners
   - Meta: 2-5% para nativos

3. **eCPM Efetivo**
   - Comparar com projeções
   - Otimizar posições de baixo desempenho

4. **Conversão Free → Premium**
   - Taxa de upgrade após ver anúncios
   - Tempo médio até upgrade

---

## ⚡ Otimizações Futuras

### **Fase 2: A/B Testing**
- [ ] Testar banner top vs nativo no Dashboard
- [ ] Otimizar timing dos intersticiais
- [ ] Testar diferentes slots de AdSense

### **Fase 3: Advanced**
- [ ] Rewarded Ads (assista para desbloquear feature)
- [ ] Google Ad Manager (controle avançado)
- [ ] Segmentação por comportamento do usuário

---

## 📝 Checklist de Implementação

- [x] ✅ Sistema de detecção de plataforma
- [x] ✅ Componentes AdSense e AdMob
- [x] ✅ Integração com sistema Premium
- [x] ✅ Posicionamentos estratégicos
- [x] ✅ Intersticiais com controle de frequência
- [ ] ⏳ Configurar IDs reais do AdSense
- [ ] ⏳ Configurar IDs reais do AdMob
- [ ] ⏳ Atualizar script no index.html
- [ ] ⏳ Testar em domínio personalizado
- [ ] ⏳ Ativar categorias "Finanças" no AdSense

---

**Arquivos de Configuração Principais:**

1. `src/utils/adConfig.ts` - IDs e configurações
2. `src/components/ads/AdSenseComponent.tsx` - Componente web (linha 37)
3. `index.html` - Script do AdSense (linha 17)
4. `src/utils/adInterstitial.ts` - Gerenciador de intersticiais mobile

---

**Próximos Passos:**
1. Obter Publisher ID do Google AdSense
2. Criar unidades de anúncio (banner, native, sidebar)
3. Configurar app no Google AdMob
4. Atualizar todos os IDs nos arquivos listados acima
5. Testar em staging antes de produção
