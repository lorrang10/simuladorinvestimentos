# 🔧 Como Configurar IDs do AdSense e AdMob

## 📋 Passo a Passo Completo

### **PARTE 1: Google AdSense (Web)**

#### 1.1 Criar Conta AdSense
1. Acesse: https://www.google.com/adsense/
2. Clique em "Começar"
3. Preencha dados do site: `https://simuladorinvestimentos.lovable.app`
4. Aguarde aprovação (pode levar 24-48h)

#### 1.2 Obter Publisher ID
Após aprovação:
1. Faça login no AdSense
2. Vá em "Conta" → "Configurações"
3. Copie seu **Publisher ID** (formato: `ca-pub-XXXXXXXXXX`)

#### 1.3 Criar Unidades de Anúncio
No painel do AdSense:

**Banner Top/Footer:**
1. Vá em "Anúncios" → "Visão Geral" → "Por unidade de anúncio"
2. Clique em "Criar unidade de anúncio" → "Display"
3. Nome: "Banner Top - Simulador"
4. Tamanho: "Responsivo"
5. Copie o **ID da unidade** (formato: `1234567890`)

**Anúncio Nativo:**
1. "Criar unidade de anúncio" → "In-feed"
2. Nome: "Nativo - Resultados"
3. Escolha um estilo que combine com seu app (escuro)
4. Copie o **ID da unidade**

**Banner Sidebar:**
1. "Criar unidade de anúncio" → "Display"
2. Nome: "Sidebar Desktop"
3. Tamanho: "Retângulo médio (300x250)"
4. Copie o **ID da unidade**

#### 1.4 Configurar no Código

**Arquivo 1: `src/utils/adConfig.ts`** (linha 5)
```typescript
adsense: {
  publisherId: 'ca-pub-1234567890',  // ← SEU ID AQUI
  slots: {
    banner: '1234567890',     // ← ID do Banner Top
    sidebar: '0987654321',    // ← ID do Sidebar
    native: '1122334455',     // ← ID do Nativo
    footer: '6677889900'      // ← ID do Footer (criar se precisar)
  }
}
```

**Arquivo 2: `src/components/ads/AdSenseComponent.tsx`** (linha 37)
```typescript
data-ad-client="ca-pub-1234567890" // ← SEU ID AQUI
```

**Arquivo 3: `index.html`** (linha 17)
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890" crossorigin="anonymous"></script>
<!-- ↑ SEU ID AQUI -->
```

---

### **PARTE 2: Google AdMob (Mobile - Android/iOS)**

#### 2.1 Criar Conta AdMob
1. Acesse: https://admob.google.com/
2. Faça login com mesma conta do Google
3. Clique em "Começar"
4. Complete o cadastro

#### 2.2 Criar App Android

1. No AdMob, clique em "Apps" → "Adicionar app"
2. Escolha "Android"
3. Nome: "Simulador Investimentos"
4. ID do pacote: `app.lovable.cf08df7441d24acd9ac0313c4b31fd38`
5. Clique em "Adicionar"

**Copie o ID do App** (formato: `ca-app-pub-XXXXX~YYYYYYY`)

#### 2.3 Criar Unidades de Anúncio (Android)

**Banner Android:**
1. Dentro do app criado, clique em "Unidades de anúncio"
2. Clique em "Criar unidade de anúncio" → "Banner"
3. Nome: "Banner Android - Rodapé"
4. Copie o **ID da unidade** (formato: `ca-app-pub-XXXXX/ZZZZZZZ`)

**Intersticial Android:**
1. "Criar unidade de anúncio" → "Intersticial"
2. Nome: "Intersticial Android - Pós-simulação"
3. Copie o **ID da unidade**

**Opcional - Rewarded Android:**
1. "Criar unidade de anúncio" → "Premiado"
2. Nome: "Premiado Android - Desbloqueio"
3. Copie o **ID da unidade**

#### 2.4 Criar App iOS

Repita os passos 2.2 e 2.3, mas escolhendo "iOS" e usando:
- ID do pacote: `app.lovable.cf08df7441d24acd9ac0313c4b31fd38`

#### 2.5 Configurar no Código

**Arquivo: `src/utils/adConfig.ts`** (linha 17)
```typescript
admob: {
  android: {
    banner: 'ca-app-pub-XXXXX/1234567',        // ← ID Banner Android
    interstitial: 'ca-app-pub-XXXXX/7654321',  // ← ID Intersticial Android
    rewarded: 'ca-app-pub-XXXXX/1111111'       // ← ID Premiado Android (opcional)
  },
  ios: {
    banner: 'ca-app-pub-XXXXX/9876543',        // ← ID Banner iOS
    interstitial: 'ca-app-pub-XXXXX/3456789',  // ← ID Intersticial iOS
    rewarded: 'ca-app-pub-XXXXX/9999999'       // ← ID Premiado iOS (opcional)
  }
}
```

---

### **PARTE 3: Configurar Domínio Personalizado** (Futuro)

#### 3.1 Quando Comprar Domínio Próprio

1. **No Google AdSense:**
   - Vá em "Sites" → "Adicionar site"
   - Digite seu novo domínio (ex: `simuladorinvestimentos.com.br`)
   - Aguarde verificação (pode levar 24h)

2. **Atualizar Código:**
   - Os IDs permanecem os mesmos
   - Apenas verifique se o domínio está aprovado no AdSense

3. **Políticas de Conteúdo:**
   - Certifique-se de ter:
     - Política de Privacidade
     - Termos de Uso
     - Sobre Nós
     - Contato

---

## ⚠️ IDs de Teste (Não Remuneram!)

Enquanto testa, você pode usar os IDs de teste do Google:

### **AdMob - IDs de Teste:**
```typescript
// ANDROID - TESTE
banner: 'ca-app-pub-3940256099942544/6300978111'
interstitial: 'ca-app-pub-3940256099942544/1033173712'
rewarded: 'ca-app-pub-3940256099942544/5224354917'

// iOS - TESTE
banner: 'ca-app-pub-3940256099942544/2934735716'
interstitial: 'ca-app-pub-3940256099942544/4411468910'
rewarded: 'ca-app-pub-3940256099942544/1712485313'
```

**⚠️ IMPORTANTE**: Os IDs de teste **NÃO geram receita**. Substitua pelos IDs reais antes de lançar em produção!

---

## ✅ Checklist Antes de Publicar

### **AdSense:**
- [ ] Conta AdSense criada e aprovada
- [ ] Publisher ID configurado em 3 locais (adConfig.ts, AdSenseComponent.tsx, index.html)
- [ ] Unidades de anúncio criadas (banner, native, sidebar)
- [ ] IDs das unidades configurados em adConfig.ts
- [ ] Domínio adicionado e verificado no AdSense
- [ ] Política de Privacidade publicada
- [ ] Políticas do AdSense cumpridas

### **AdMob:**
- [ ] Conta AdMob criada
- [ ] App Android criado e configurado
- [ ] App iOS criado e configurado
- [ ] Unidades de anúncio criadas (banner, interstitial)
- [ ] IDs configurados em adConfig.ts
- [ ] IDs de teste removidos (trocar pelos reais)
- [ ] Testado em dispositivo físico

---

## 🧪 Como Testar

### **Web (AdSense):**
1. Faça build do projeto: `npm run build`
2. Rode localmente: `npm run preview`
3. Abra em navegador normal (não incógnito)
4. Verifique se anúncios aparecem (pode levar alguns minutos)
5. Console do navegador não deve ter erros relacionados ao AdSense

### **Mobile (AdMob):**
1. Build do app nativo: `npx cap sync`
2. Rode em emulador/dispositivo: `npx cap run android` ou `npx cap run ios`
3. Complete uma simulação para ver intersticial
4. Verifique logs do console para erros do AdMob

---

## 📞 Suporte

### **Problemas Comuns:**

**"Anúncios não aparecem no AdSense"**
- Aguarde 30-60 minutos após configuração
- Limpe cache do navegador
- Verifique se domínio está aprovado
- Veja console do navegador para erros

**"AdMob não carrega no mobile"**
- Verifique se IDs estão corretos
- Confirme que build foi sincronizado: `npx cap sync`
- Teste em dispositivo físico (melhor que emulador)
- Veja logs do Logcat (Android) ou Xcode (iOS)

**"Conta AdSense não aprovada"**
- Aguarde 24-48h
- Adicione mais conteúdo útil ao site
- Certifique-se de ter política de privacidade
- Evite conteúdo duplicado

---

## 📚 Documentação Oficial

- AdSense: https://support.google.com/adsense
- AdMob: https://support.google.com/admob
- Plugin AdMob: https://github.com/capacitor-community/admob

---

**Última atualização**: Guia de configuração inicial
**Próxima revisão**: Após configurar IDs reais
