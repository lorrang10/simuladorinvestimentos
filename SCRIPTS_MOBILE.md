# 📜 Scripts Mobile Recomendados

Como não é possível modificar o `package.json` diretamente, aqui estão os scripts que você deve adicionar manualmente após exportar o projeto:

## 🔧 Adicionar ao package.json

Abra seu `package.json` e adicione estes scripts na seção `"scripts"`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    
    // 📱 ADICIONAR ESTES SCRIPTS MOBILE:
    "mobile:build": "npm run build && npx cap sync",
    "mobile:build:prod": "npm run build && npx cap copy && npx cap update",
    "mobile:android": "npx cap run android",
    "mobile:android:dev": "npx cap run android --livereload --external",
    "mobile:ios": "npx cap run ios",
    "mobile:ios:dev": "npx cap run ios --livereload --external",
    "mobile:sync": "npx cap sync",
    "mobile:copy": "npx cap copy",
    "mobile:update": "npx cap update",
    "mobile:open:android": "npx cap open android",
    "mobile:open:ios": "npx cap open ios",
    "mobile:clean": "npx cap clean android && npx cap clean ios",
    "mobile:doctor": "npx cap doctor"
  }
}
```

## 🚀 Como usar os scripts

### Desenvolvimento
```bash
# Build e sincronizar (sempre fazer após mudanças)
npm run mobile:build

# Executar no emulador/dispositivo
npm run mobile:android    # Android
npm run mobile:ios        # iOS

# Desenvolvimento com hot-reload
npm run mobile:android:dev
npm run mobile:ios:dev
```

### Produção
```bash
# Build de produção completo
npm run mobile:build:prod

# Abrir no IDE para build final
npm run mobile:open:android   # Android Studio
npm run mobile:open:ios       # Xcode
```

### Manutenção
```bash
# Limpar cache (se houver problemas)
npm run mobile:clean

# Verificar configuração
npm run mobile:doctor

# Apenas sincronizar (após npm run build)
npm run mobile:sync
```

## 📱 Workflow Recomendado

### 1. Desenvolvimento Diário
```bash
# Fazer mudanças no código web
# Depois executar:
npm run mobile:build
npm run mobile:android    # ou ios
```

### 2. Deploy para Stores
```bash
# 1. Build de produção
npm run mobile:build:prod

# 2. Abrir IDE
npm run mobile:open:android   # Para Android Studio
npm run mobile:open:ios       # Para Xcode

# 3. No IDE: Build → Generate Signed Bundle/APK (Android)
# 4. No IDE: Product → Archive (iOS)
```

### 3. Troubleshooting
```bash
# Se algo não funcionar:
npm run mobile:clean
npm run mobile:build:prod
npm run mobile:doctor
```

## 💡 Dicas de Uso

- **Sempre** execute `mobile:build` após mudanças no código web
- Use `mobile:doctor` para diagnosticar problemas
- `mobile:clean` resolve a maioria dos problemas de cache
- Scripts com `:dev` habilitam live-reload para desenvolvimento mais rápido

---

**Copie e cole estes scripts no seu package.json após exportar o projeto!** 🎯