# Estratégia de Monetização - AdSense + AdMob

## 📊 Anúncios Implementados por ROI

### **Alta Rentabilidade (eCPM > $5)**

#### 1. **Intersticiais Mobile (AdMob)**
- **Localização**: Após completar simulação de investimento
- **eCPM Esperado**: $8-15
- **Estratégia**: 
  - Intervalo mínimo de 3 minutos entre anúncios
  - Apenas em ações importantes (completar simulação)
  - Não exibido para usuários premium
- **Implementação**: `src/utils/adInterstitial.ts`

#### 2. **Anúncios Nativos (AdSense Web)**
- **Localização**: Entre resultados da simulação
- **eCPM Esperado**: $4-8
- **Estratégia**: 
  - Integrados ao design do app
  - Aparecem no contexto de conteúdo relevante
  - Alta taxa de cliques (CTR 2-4%)
- **Implementação**: `SimularInvestimento.tsx` linha ~605

### **Média Rentabilidade (eCPM $2-5)**

#### 3. **Banner Responsivo Top (AdSense Web)**
- **Localizações**: 
  - Topo do Dashboard
  - Topo do Simulador de Investimento
- **eCPM Esperado**: $3-6
- **Estratégia**: 
  - Primeira coisa visível ao usuário
  - Responsivo para mobile/desktop
  - Não intrusivo
- **Implementação**: 
  - `Dashboard.tsx` linha ~156
  - `SimularInvestimento.tsx` linha ~291

#### 4. **Banner Lateral Sidebar (AdSense Web - Desktop)**
- **Localização**: Sidebar esquerda (apenas desktop)
- **eCPM Esperado**: $2-4
- **Estratégia**: 
  - Visível durante toda a navegação
  - Apenas quando sidebar não está colapsada
  - Formato quadrado/retangular
- **Implementação**: `app-sidebar.tsx` linha ~109

### **Baixa Rentabilidade (eCPM $1-2)**

#### 5. **Banner Rodapé (AdMob Mobile)**
- **Localização**: Rodapé fixo em mobile
- **eCPM Esperado**: $1-3
- **Estratégia**: 
  - Sempre visível mas não intrusivo
  - Bom para preenchimento de inventário
- **Implementação**: Via `AdMobComponent.tsx`

---

## 💰 Projeção de Receita Mensal

### **Cenários Estimados (baseado em 1000 usuários ativos/mês)**

| Tipo de Anúncio | Impressões/Usuário | eCPM | Receita/1000 usuários |
|-----------------|-------------------|------|----------------------|
| Intersticiais Mobile | 2-3 | $10 | $20-30 |
| Nativos Web | 1-2 | $6 | $6-12 |
| Banner Top | 3-5 | $4 | $12-20 |
| Sidebar Desktop | 5-10 | $3 | $15-30 |
| **TOTAL MENSAL** | - | - | **$53-92** |

### **Projeção com Crescimento**

- **1.000 usuários/mês**: $50-90
- **5.000 usuários/mês**: $250-450
- **10.000 usuários/mês**: $500-900
- **50.000 usuários/mês**: $2.500-4.500

---

## 🎯 Otimizações para Máximo ROI

### **1. Frequência de Anúncios**
- ✅ Intersticiais: Máximo 1 a cada 3 minutos
- ✅ Banners: Sempre visíveis mas não repetitivos
- ✅ Nativos: Apenas em contextos relevantes

### **2. Experiência do Usuário**
- ✅ Anúncios integrados ao design
- ✅ Nunca bloquear funcionalidades essenciais
- ✅ Incentivo claro para upgrade Premium (remove todos os anúncios)

### **3. A/B Testing Recomendado**
- Testar posições de banners nativos
- Otimizar timing dos intersticiais
- Testar diferentes tamanhos de banner

### **4. Segmentação**
- Anúncios financeiros têm eCPM 30-50% maior
- Configurar categorias relevantes no AdSense
- Usar palavras-chave: investimentos, finanças, economia

---

## 📱 Diferenças Web vs Mobile

### **Web (AdSense)**
- Foco em banners responsivos e nativos
- Maior espaço para sidebar
- Melhor para conteúdo longo (Dashboard)

### **Mobile (AdMob)**
- Intersticiais de alto valor
- Banners adaptativos otimizados
- Possibilidade de rewarded ads futuro

---

## 🚀 Próximos Passos

### **Fase 1: Configuração** ✅
- [x] Implementar componentes base
- [x] Configurar posicionamentos estratégicos
- [x] Integrar com sistema Premium

### **Fase 2: Otimização** (Próximas 2-4 semanas)
- [ ] Adicionar IDs reais do AdSense/AdMob
- [ ] Configurar domínio personalizado
- [ ] Ativar categorias de anúncios financeiros
- [ ] Implementar tracking de performance

### **Fase 3: Expansão** (Após 1 mês)
- [ ] Adicionar rewarded ads (assista anúncio para desbloquear feature)
- [ ] A/B testing de posicionamentos
- [ ] Otimizar com base em analytics
- [ ] Considerar Google Ad Manager para controle avançado

---

## ⚙️ Configuração Necessária

### **1. Google AdSense (Web)**
```typescript
// Editar: src/utils/adConfig.ts
adsense: {
  publisherId: 'ca-pub-SEU_ID_REAL', // Substituir pelo seu ID real
  slots: {
    banner: 'SEU_SLOT_BANNER',
    sidebar: 'SEU_SLOT_SIDEBAR',
    native: 'SEU_SLOT_NATIVE',
  }
}
```

**⚠️ IMPORTANTE**: Também editar em `src/components/ads/AdSenseComponent.tsx` linha 37:
```typescript
data-ad-client="ca-pub-SEU_ID_REAL" // Substituir
```

### **2. Google AdMob (Mobile)**
```typescript
// Editar: src/utils/adConfig.ts
admob: {
  android: {
    banner: 'ca-app-pub-SEU_ID/BANNER_ANDROID',
    interstitial: 'ca-app-pub-SEU_ID/INTERSTITIAL_ANDROID',
  },
  ios: {
    banner: 'ca-app-pub-SEU_ID/BANNER_IOS',
    interstitial: 'ca-app-pub-SEU_ID/INTERSTITIAL_IOS',
  }
}
```

### **3. HTML (AdSense Script)**
```html
<!-- Editar: index.html linha 17 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_ID_REAL"></script>
```

**Após configurar seu domínio personalizado:**
1. Adicionar domínio no Google AdSense
2. Aguardar aprovação (pode levar 24-48h)
3. Verificar políticas de conteúdo
4. Ativar categorias "Finanças" e "Investimentos" para maior eCPM

---

## 📈 Métricas para Acompanhar

### **Dashboard AdSense**
- RPM (Receita por mil impressões)
- CTR (Taxa de cliques)
- Receita por tipo de anúncio
- Performance por dispositivo

### **Dashboard AdMob**
- eCPM por tipo de anúncio
- Taxa de preenchimento
- Impressões por usuário
- Receita por plataforma (Android vs iOS)

### **Google Analytics**
- Conversão Free → Premium
- Taxa de abandono por página
- Tempo médio com anúncios visíveis
- Bounce rate em páginas com anúncios

---

## 🎓 Dicas de Compliance

### **Políticas do AdSense**
- ✅ Nunca pedir para clicar em anúncios
- ✅ Não colocar anúncios em pop-ups
- ✅ Respeitar espaçamento mínimo
- ✅ Conteúdo adequado para monetização

### **LGPD/GDPR**
- ✅ Implementar consent banner (futuro)
- ✅ Permitir opt-out de personalização
- ✅ Política de privacidade atualizada

---

## 💡 Insights Finais

1. **Intersticiais são o maior ROI** mas devem ser usados com moderação
2. **Anúncios nativos** têm melhor CTR que banners tradicionais
3. **Premium como incentivo** é essencial - destaque a remoção de anúncios
4. **Mobile first** - maior parte dos usuários provavelmente será mobile
5. **Teste constantemente** - pequenas mudanças podem dobrar o ROI

---

**Última atualização**: Implementação inicial
**Próxima revisão**: Após 30 dias com dados reais
