# 📱 Configuração Mobile - Simulador de Investimentos

Este guia completo te ajudará a configurar e fazer o deploy do Simulador de Investimentos como aplicativo nativo Android e iOS.

## ✅ Status da Configuração

- ✅ **Capacitor**: Instalado e configurado
- ✅ **Dependências**: Android e iOS adicionadas
- ✅ **PWA**: Manifest.json otimizado para mobile
- ✅ **Design**: Responsivo com Tailwind CSS
- ✅ **Segurança**: Headers de segurança implementados

## 🚀 Início Rápido

### Pré-requisitos
- **Node.js** 18+ instalado
- **Git** configurado
- **Android Studio** (para Android)
- **Xcode** (para iOS - apenas macOS)

### 1. Clonar e Configurar
```bash
# 1. Exportar projeto do Lovable para GitHub
# 2. Clonar seu repositório
git clone [SEU-REPOSITORIO]
cd simuladorinvestimentos

# 3. Instalar dependências
npm install

# 4. Adicionar plataformas nativas
npx cap add android    # Para Android
npx cap add ios        # Para iOS (apenas macOS)

# 5. Atualizar dependências nativas
npx cap update android
npx cap update ios     # Se usando iOS
```

### 2. Build e Deploy
```bash
# Build da aplicação web
npm run build

# Sincronizar com plataformas nativas
npx cap sync

# Abrir no IDE nativo
npx cap open android   # Android Studio
npx cap open ios       # Xcode (macOS)
```

## 📋 Scripts Úteis Recomendados

Adicione estes scripts ao seu `package.json` para facilitar o desenvolvimento:

```json
{
  "scripts": {
    "mobile:build": "npm run build && npx cap sync",
    "mobile:android": "npx cap run android",
    "mobile:ios": "npx cap run ios",
    "mobile:sync": "npx cap sync",
    "mobile:open:android": "npx cap open android",
    "mobile:open:ios": "npx cap open ios"
  }
}
```

## 🔧 Configuração de Produção

### Android Studio
1. **Configurar Signing**
   - Vá em `Build` → `Generate Signed Bundle/APK`
   - Crie ou use um keystore existente
   - Configure o `build.gradle` com as informações de signing

2. **Otimizar Build**
   - Ative `minifyEnabled true`
   - Configure ProGuard/R8
   - Otimize recursos com `shrinkResources true`

### Xcode (iOS)
1. **Apple Developer Account**
   - Configure seu Team ID
   - Atualize Bundle Identifier se necessário

2. **Configuração de Release**
   - Selecione `Product` → `Archive`
   - Use Xcode Organizer para upload

## 🎨 Configurações Específicas Mobile

### Capacitor Config para Produção
O projeto inclui `capacitor.config.production.ts` otimizado para produção:
- Remove servidor de desenvolvimento
- Configura splash screen
- Otimiza teclado e status bar
- Define configurações de build Android/iOS

Para usar em produção, renomeie:
```bash
mv capacitor.config.ts capacitor.config.dev.ts
mv capacitor.config.production.ts capacitor.config.ts
```

### PWA Otimizada
- **Manifest.json** configurado para instalação mobile
- **Service Worker** pronto (se implementado)
- **Ícones** em múltiplas resoluções
- **Orientação** otimizada para portrait

## 📱 Funcionalidades Mobile Verificadas

### ✅ Responsividade
- ✅ Layout adapta a telas pequenas
- ✅ Navegação otimizada para touch
- ✅ Modais responsivos com scroll
- ✅ Gráficos adaptáveis

### ✅ Performance
- ✅ Lazy loading implementado
- ✅ Skeleton loaders
- ✅ Otimização de imagens
- ✅ Bundle splitting com Vite

### ✅ UX Mobile
- ✅ Botões touch-friendly
- ✅ Feedback visual adequado
- ✅ Navegação por gestos
- ✅ Teclado virtual otimizado

## 🔒 Segurança Mobile

### Headers Implementados
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Autenticação Supabase
- ✅ RLS (Row Level Security) ativa
- ✅ JWT tokens seguros
- ✅ Session management otimizada
- ✅ Verificação de email configurada

## 🎯 Planos de Assinatura Mobile

O app suporta totalmente o sistema de assinaturas:
- **Plano Free**: Funcionalidades básicas
- **Plano Premium**: Recursos avançados desbloqueados
- **Stripe Integration**: Pagamentos seguros
- **Customer Portal**: Gerenciamento de assinatura

## 🚀 Deploy Stores

### Google Play Store (Android)
1. Gerar AAB (Android App Bundle):
   ```bash
   # No Android Studio
   Build → Generate Signed Bundle/APK → Android App Bundle
   ```

2. Upload no Google Play Console
3. Configurar store listing
4. Revisar e publicar

### App Store (iOS)
1. Archive no Xcode:
   ```bash
   Product → Archive
   ```

2. Upload via Xcode Organizer
3. App Store Connect configuration
4. Review e publicação

## 🔍 Troubleshooting

### Problemas Comuns

**Build falha no Android:**
```bash
npx cap clean android
npx cap sync android
```

**Erro de certificado iOS:**
- Verificar Apple Developer account
- Revisar Bundle ID e Team settings

**App não carrega:**
```bash
npm run build
npx cap sync
```

**Performance lenta:**
- Verificar se `npm run build` foi executado
- Considerar lazy loading adicional

### Comandos de Debug
```bash
# Logs detalhados
npx cap run android --verbose
npx cap run ios --verbose

# Limpar cache
npx cap clean android
npx cap clean ios

# Atualizar Capacitor
npm update @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

## 📚 Recursos Adicionais

- [Documentação Capacitor](https://capacitorjs.com/docs)
- [Guias Android](https://developer.android.com/guide)
- [Guias iOS](https://developer.apple.com/documentation/)
- [Blog Lovable Mobile](https://lovable.dev/blogs/TODO)

## ✨ Próximos Passos

1. **Testar em dispositivo físico**
2. **Configurar CI/CD para builds automatizados**
3. **Implementar push notifications (se necessário)**
4. **Adicionar analytics mobile**
5. **Configurar crash reporting**

---

**🎉 Parabéns!** Seu projeto está totalmente preparado para deploy mobile. Siga os passos acima e você terá apps nativos funcionando em produção.

**📝 Lembre-se:** Sempre execute `npx cap sync` após mudanças no código web para sincronizar com as plataformas nativas.