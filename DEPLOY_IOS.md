# Deploy iOS - Simulador de Investimentos

Este guia te ajudará a fazer o deploy do Simulador de Investimentos como um app iOS nativo.

## Pré-requisitos

- **Mac** com macOS
- **Xcode** instalado (disponível na App Store)
- **Node.js** instalado
- Conta de desenvolvedor Apple (para deploy na App Store)

## Passo a Passo

### 1. Preparar o Projeto

```bash
# Clone o projeto do GitHub
git clone [seu-repositorio]
cd simuladorinvestimentos

# Instale as dependências
npm install
```

### 2. Adicionar Plataforma iOS

```bash
# Adicione a plataforma iOS
npx cap add ios

# Atualize as dependências nativas
npx cap update ios
```

### 3. Build do Projeto

```bash
# Faça o build da aplicação web
npm run build

# Sincronize com o projeto nativo iOS
npx cap sync ios
```

### 4. Abrir no Xcode

```bash
# Abra o projeto no Xcode
npx cap open ios
```

### 5. Configurar no Xcode

No Xcode, você precisará:

1. **Selecionar Team de Desenvolvimento**
   - Vá em "Signing & Capabilities"
   - Selecione seu Apple Developer Team

2. **Configurar Bundle Identifier**
   - O Bundle ID já está configurado como: `app.lovable.cf08df7441d24acd9ac0313c4b31fd38`
   - Você pode alterar se necessário

3. **Verificar Configurações do App**
   - Nome: Simulador de Investimentos
   - Ícones: Já configurados automaticamente

### 6. Testar no Simulador

1. No Xcode, selecione um simulador iOS
2. Clique no botão "Play" ou use `Cmd + R`
3. O app será compilado e executado no simulador

### 7. Testar em Dispositivo Físico

1. Conecte seu iPhone/iPad via cabo USB
2. Selecione seu dispositivo no Xcode
3. Clique em "Play" para instalar e executar

**Nota**: Para testar em dispositivo físico, você precisa de uma conta Apple Developer (gratuita para teste, paga para distribuição).

### 8. Deploy na App Store

Para publicar na App Store:

1. **Preparar para Produção**
   ```bash
   # Build de produção
   npm run build
   npx cap sync ios
   ```

2. **Configurar no Xcode**
   - Altere o Bundle ID para algo único
   - Configure ícones e splash screens
   - Adicione descrições e metadados

3. **Archive e Upload**
   - No Xcode: Product → Archive
   - Use o Xcode Organizer para upload

## Troubleshooting

### Erro de Certificado
- Verifique se você está logado com sua Apple ID no Xcode
- Certifique-se de ter uma conta Apple Developer

### Build Falha
- Execute `npx cap sync ios` novamente
- Limpe o build: Product → Clean Build Folder no Xcode

### App não Carrega
- Verifique se `npm run build` foi executado
- Confirme que `npx cap sync ios` foi executado após o build

## Recursos Adicionais

- [Documentação oficial Capacitor iOS](https://capacitorjs.com/docs/ios)
- [Guias Apple Developer](https://developer.apple.com/documentation/)
- [Blog post Lovable sobre mobile](https://lovable.dev/blogs/TODO)

## Estrutura de Arquivos iOS

Após adicionar iOS, você terá:
```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift
│   │   ├── capacitor.config.json
│   │   └── config.xml
│   └── App.xcodeproj
└── Podfile
```

## Comandos Úteis

```bash
# Sincronizar mudanças
npx cap sync ios

# Abrir no Xcode
npx cap open ios

# Executar no dispositivo/simulador
npx cap run ios

# Atualizar dependências nativas
npx cap update ios
```

---

**Importante**: Sempre execute `npx cap sync ios` após fazer mudanças no código web para sincronizar com o projeto nativo iOS.