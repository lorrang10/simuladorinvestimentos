# Sistema de Anúncios AdSense + AdMob

## Configuração Implementada

### ✅ Componentes Criados

1. **AdManager.tsx** - Gerenciador principal que escolhe entre AdSense (web) e AdMob (mobile)
2. **AdSenseComponent.tsx** - Anúncios para navegador web
3. **AdMobComponent.tsx** - Anúncios para aplicativo mobile (Android/iOS)
4. **AdWrapper.tsx** - Wrapper condicional baseado no status premium
5. **AdBanner.tsx** - Componente de banner genérico
6. **useAdPlatform.ts** - Hook para detecção de plataforma
7. **useAdVisibility.ts** - Hook para controlar visibilidade baseada no premium
8. **adConfig.ts** - Configurações centralizadas

### ✅ Posicionamento Implementado

- **Simulador de Investimento**: Banner no topo e entre seções
- **Sidebar**: Banner lateral (apenas quando não colapsada)
- **Resultados**: Anúncios entre gráficos e métricas

### ⚙️ Próximos Passos

#### 1. Configurar IDs Reais
Editar `src/utils/adConfig.ts`:
```typescript
adsense: {
  publisherId: 'ca-pub-SEU_ID_AQUI', // Substituir pelo seu Publisher ID
  slots: {
    banner: 'SEU_SLOT_ID_AQUI',
    // ... outros slots
  }
}
```

#### 2. Atualizar HTML
Editar `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_ID_AQUI" crossorigin="anonymous"></script>
```

#### 3. Configurar AdMob para Mobile
- Criar conta no Google AdMob
- Configurar app Android/iOS
- Atualizar IDs em `adConfig.ts`
- Testar em dispositivo físico

#### 4. Domínio Personalizado
Quando migrar para domínio próprio:
- Atualizar configurações no Google AdSense
- Adicionar novo domínio nas configurações
- Verificar políticas de conteúdo

### 🎯 Estratégia de Monetização

**Para usuários FREE:**
- Anúncios estratégicos em locais não invasivos
- Incentivo claro para upgrade Premium
- UX preservada com anúncios integrados

**Para usuários PREMIUM:**
- Nenhum anúncio exibido
- Valor claro da assinatura (remoção de anúncios)

### 📱 Suporte a Plataformas

- **Web (Navegador)**: Google AdSense
- **Android App**: Google AdMob
- **iOS App**: Google AdMob
- **Detecção automática** via Capacitor

### 🔒 Compliance

- LGPD/GDPR ready (consent management)
- Políticas do AdSense respeitadas
- Conteúdo adequado para monetização

### 📊 Monitoramento

Use o dashboard do AdSense/AdMob para:
- Acompanhar receita
- Otimizar posicionamento
- Analisar performance por dispositivo
- Ajustar estratégias de monetização