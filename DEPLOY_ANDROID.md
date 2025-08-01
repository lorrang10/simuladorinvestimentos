# Deploy Android - Simulador de Investimentos

## Configuração do Aplicativo Android

O projeto já está configurado com Capacitor para deploy como aplicativo Android nativo.

### Pré-requisitos

- Node.js 18+ instalado
- Android Studio instalado
- Java Development Kit (JDK) 11 ou superior
- Git

### Passos para Deploy

#### 1. Exportar e Configurar o Projeto

1. Clique no botão "Export to Github" no Lovable
2. Clone o repositório para sua máquina:
```bash
git clone [SEU_REPOSITORIO_URL]
cd simuladorinvestimentos
```

#### 2. Instalar Dependências

```bash
npm install
```

#### 3. Adicionar Plataforma Android

```bash
npx cap add android
```

#### 4. Atualizar Dependências Nativas

```bash
npx cap update android
```

#### 5. Build do Projeto

```bash
npm run build
```

#### 6. Sincronizar com Android

```bash
npx cap sync android
```

#### 7. Abrir no Android Studio

```bash
npx cap open android
```

### Configurações do App

- **App ID**: app.lovable.cf08df7441d24acd9ac0313c4b31fd38
- **App Name**: simuladorinvestimentos
- **Ícone**: Ícone personalizado com tema financeiro já configurado
- **Orientação**: Portrait (retrato)
- **Tema**: Dark com cores personalizadas

### Deploy na Play Store

#### 1. Configurar Release Build

No Android Studio:
1. Vá em **Build** > **Generate Signed Bundle/APK**
2. Selecione **Android App Bundle**
3. Crie ou use um keystore existente
4. Configure as informações de release

#### 2. Otimizações para Produção

Edite `capacitor.config.ts` e remova a configuração de servidor para produção:

```typescript
const config: CapacitorConfig = {
  appId: 'app.lovable.cf08df7441d24acd9ac0313c4b31fd38',
  appName: 'simuladorinvestimentos',
  webDir: 'dist',
  // Remover a seção server para produção
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false
    }
  }
};
```

#### 3. Upload na Play Console

1. Acesse [Google Play Console](https://play.google.com/console)
2. Crie um novo aplicativo
3. Faça upload do arquivo .aab gerado
4. Configure store listing, screenshots, descrição
5. Configure preços e distribuição
6. Submeta para revisão

### Comandos Importantes

- **Desenvolvimento**: `npx cap run android` (executa em emulador/dispositivo)
- **Sincronizar**: `npx cap sync android` (após mudanças no código)
- **Build**: `npm run build && npx cap sync android`

### Suporte a Hot Reload

Durante o desenvolvimento, o app está configurado para hot reload direto do Lovable sandbox, facilitando testes rápidos.

### Responsividade

O sistema já é totalmente responsivo e se adapta automaticamente às diferentes telas Android, utilizando Tailwind CSS para layouts flexíveis.

### Próximos Passos

Após seguir estes passos, você terá:
1. ✅ Aplicativo Android nativo
2. ✅ Ícone personalizado
3. ✅ Configuração para Play Store
4. ✅ Interface responsiva
5. ✅ Tema dark profissional

Para mais informações sobre desenvolvimento mobile com Capacitor, consulte: https://lovable.dev/blogs/TODO