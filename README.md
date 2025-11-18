# My Wallet

Aplicativo mobile de gerenciamento financeiro pessoal desenvolvido com React Native e Expo. Permite o controle de múltiplas carteiras, transações, categorias e anotações financeiras com armazenamento local.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Navegação](#navegação)
- [Estilização](#estilização)
- [Build e Deploy](#build-e-deploy)
- [Configurações](#configurações)

## 🚀 Tecnologias

### Core
- **React Native** `0.81.4` - Framework mobile multiplataforma
- **Expo** `^54.0.0` - Plataforma e ferramentas para React Native
- **TypeScript** `^5.9.2` - Tipagem estática
- **React** `19.1.0` - Biblioteca JavaScript para interfaces

### Navegação e Roteamento
- **Expo Router** `~6.0.12` - Sistema de roteamento baseado em arquivos
- **React Navigation** `^7.0.0` - Navegação nativa
- **@react-navigation/drawer** `^7.5.10` - Navegação em gaveta

### Armazenamento
- **expo-sqlite** `~16.0.8` - Banco de dados SQLite local
- **@react-native-async-storage/async-storage** `2.2.0` - Armazenamento assíncrono chave-valor

### Gerenciamento de Estado
- **Zustand** `^5.0.8` - Biblioteca de gerenciamento de estado leve

### Estilização
- **NativeWind** `^4.2.1` - Tailwind CSS para React Native
- **Tailwind CSS** `^3.4.14` - Framework CSS utilitário
- **tailwindcss-animate** `^1.0.7` - Animações para Tailwind

### UI Components
- **React Native Reusables** - Componentes UI reutilizáveis
- **@rn-primitives/** - Primitivos de UI (dropdown-menu, select, tabs, switch, etc.)
- **lucide-react-native** `^0.545.0` - Ícones
- **react-native-gifted-charts** `^1.4.64` - Gráficos e visualizações

### Animações e Gestos
- **react-native-reanimated** `~4.1.1` - Animações de alto desempenho
- **react-native-gesture-handler** `~2.28.0` - Sistema de gestos
- **react-native-worklets** `0.5.1` - Worklets para animações

### Utilitários
- **clsx** `^2.1.1` - Utilitário para construção de classes CSS
- **class-variance-authority** `^0.7.1` - Gerenciamento de variantes de componentes
- **tailwind-merge** `^3.3.1` - Merge de classes Tailwind

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular baseada em:

- **File-based Routing**: Utiliza Expo Router para roteamento baseado em estrutura de arquivos
- **Component-based**: Componentes reutilizáveis organizados por funcionalidade
- **State Management**: Zustand para gerenciamento de estado global
- **Database Layer**: Hooks customizados para abstrair operações de banco de dados
- **Type Safety**: TypeScript com tipagem estrita habilitada

### Padrões de Design

- **Custom Hooks**: Hooks específicos para operações de banco de dados (`useWalletDatabase`, `useTransactionDatabase`, etc.)
- **Store Pattern**: Stores Zustand separadas por domínio (wallet, transaction, category, anotation)
- **Component Composition**: Componentes UI modulares e compostos
- **Separation of Concerns**: Separação clara entre lógica de negócio, UI e dados

## 📦 Pré-requisitos

- **Node.js** >= 18.x
- **npm**, **yarn**, **pnpm** ou **bun**
- **Expo CLI** (instalado globalmente ou via npx)
- **iOS Simulator** (apenas para macOS) ou **Android Emulator**
- **Expo Go** (opcional, para testes em dispositivos físicos)

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd my-wallet
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. **Execute em uma plataforma**

   - **iOS** (apenas macOS): Pressione `i` no terminal
   - **Android**: Pressione `a` no terminal
   - **Web**: Pressione `w` no terminal
   - **Dispositivo físico**: Escaneie o QR code com o app Expo Go

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor Expo com cache limpo |
| `npm run android` | Inicia o app no emulador Android |
| `npm run ios` | Inicia o app no simulador iOS |
| `npm run web` | Inicia o app no navegador |
| `npm run clean` | Remove `.expo` e `node_modules` |

## 📁 Estrutura do Projeto

```
my-wallet/
├── app/                    # Rotas do Expo Router
│   ├── _layout.tsx        # Layout raiz
│   ├── index.tsx          # Tela inicial (redirecionamento)
│   ├── drawer/            # Navegação em gaveta
│   │   ├── (tabs)/        # Navegação por abas
│   │   │   ├── home.tsx
│   │   │   ├── transaction.tsx
│   │   │   ├── category.tsx
│   │   │   ├── anotation.tsx
│   │   │   └── graphs.tsx
│   │   └── wallets.tsx
│   ├── new-wallet.tsx
│   ├── income.tsx
│   ├── expense.tsx
│   └── create-category.tsx
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI base
│   ├── Header/
│   ├── Graphs/
│   ├── Indicators/
│   ├── ModalTransaction/
│   ├── OnboardingModal/
│   ├── Select/
│   ├── Switch/
│   └── UpdatesModal/
├── screens/              # Telas e componentes de tela
│   ├── home/
│   ├── transaction/
│   ├── category/
│   ├── anotation/
│   ├── graphs/
│   ├── income/
│   ├── expense/
│   └── Initials/
├── database/            # Camada de banco de dados
│   ├── initialDatabase.ts
│   ├── Queries.ts
│   ├── useWalletDatabase.ts
│   ├── useTransactionDatabase.ts
│   ├── useCategoryDatabase.ts
│   └── useAnotationDatabase.ts
├── store/               # Stores Zustand
│   ├── useWalletStore.ts
│   ├── useTransactionStore.ts
│   ├── useCategoryStore.ts
│   ├── useAnotationStore.ts
│   └── useVisibilityStore.ts
├── types/               # Definições TypeScript
│   ├── wallet.ts
│   ├── transactions.ts
│   ├── category.ts
│   ├── anotation.ts
│   └── iconType.ts
├── utils/               # Funções utilitárias
│   ├── FormatCurrent.ts
│   ├── FormatDate.ts
│   └── TransformInInteger.ts
├── lib/                 # Bibliotecas e configurações
│   ├── theme.ts
│   └── utils.ts
├── assets/              # Recursos estáticos
│   └── images/
├── android/             # Código nativo Android
├── app.json             # Configuração Expo
├── eas.json             # Configuração EAS Build
├── tailwind.config.js   # Configuração Tailwind
├── tsconfig.json        # Configuração TypeScript
└── package.json         # Dependências e scripts
```

## 🗄️ Banco de Dados

O aplicativo utiliza **SQLite** local através do `expo-sqlite`. O banco de dados é inicializado automaticamente na primeira execução.

### Schema do Banco de Dados

#### Tabela: `wallets`
Armazena as carteiras do usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER PRIMARY KEY | Identificador único |
| `name` | TEXT NOT NULL | Nome da carteira |
| `balance` | INTEGER NOT NULL | Saldo (em centavos) |
| `created_at` | TEXT NOT NULL | Data de criação |

#### Tabela: `categories`
Categorias de receitas e despesas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER PRIMARY KEY | Identificador único |
| `wallet_id` | INTEGER NOT NULL | FK para wallets |
| `title` | TEXT NOT NULL | Nome da categoria |
| `type` | TEXT CHECK | 'income' ou 'expense' |
| `total` | INTEGER NOT NULL | Total acumulado |
| `icon_name` | TEXT NOT NULL | Nome do ícone |
| `icon_lib` | TEXT NOT NULL | Biblioteca do ícone |
| `created_at` | TEXT NOT NULL | Data de criação |

**Constraints**: `UNIQUE (wallet_id, title)`

#### Tabela: `transactions`
Transações financeiras.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER PRIMARY KEY | Identificador único |
| `wallet_id` | INTEGER NOT NULL | FK para wallets |
| `category_id` | INTEGER NOT NULL | FK para categories |
| `title` | TEXT NOT NULL | Descrição da transação |
| `type` | TEXT CHECK | 'income' ou 'expense' |
| `icon_name` | TEXT NOT NULL | Nome do ícone |
| `icon_lib` | TEXT NOT NULL | Biblioteca do ícone |
| `value` | INTEGER NOT NULL | Valor (em centavos) |
| `created_at` | TEXT NOT NULL | Data de criação |

#### Tabela: `anotations`
Anotações financeiras (listas de compras, planejamentos).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER PRIMARY KEY | Identificador único |
| `title` | TEXT NOT NULL | Título da anotação |
| `type` | TEXT CHECK | 'income' ou 'expense' |
| `wallet_id` | INTEGER NOT NULL | FK para wallets |
| `created_at` | TEXT NOT NULL | Data de criação |

#### Tabela: `anotations_itens`
Itens de uma anotação.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER PRIMARY KEY | Identificador único |
| `anotation_id` | INTEGER NOT NULL | FK para anotations |
| `category_id` | INTEGER NULL | FK para categories (opcional) |
| `title` | TEXT NOT NULL | Descrição do item |
| `value` | INTEGER NOT NULL | Valor (em centavos) |
| `completed` | INTEGER DEFAULT 0 | Status de conclusão (0 ou 1) |
| `created_at` | TEXT NOT NULL | Data de criação |

### Relacionamentos

- `wallets` → `categories` (1:N) - Uma carteira tem muitas categorias
- `wallets` → `transactions` (1:N) - Uma carteira tem muitas transações
- `wallets` → `anotations` (1:N) - Uma carteira tem muitas anotações
- `categories` → `transactions` (1:N) - Uma categoria tem muitas transações
- `anotations` → `anotations_itens` (1:N) - Uma anotação tem muitos itens
- `categories` → `anotations_itens` (1:N) - Uma categoria pode ter muitos itens de anotação

**Foreign Keys**: Todas as foreign keys estão configuradas com `ON DELETE CASCADE`.

## 🔄 Gerenciamento de Estado

O projeto utiliza **Zustand** para gerenciamento de estado global. As stores são organizadas por domínio:

### Stores Disponíveis

- **`useWalletStore`**: Gerencia carteiras ativas e seleção
- **`useTransactionStore`**: Gerencia transações e operações CRUD
- **`useCategoryStore`**: Gerencia categorias
- **`useAnotationStore`**: Gerencia anotações e seus itens
- **`useVisibilityStore`**: Gerencia estados de visibilidade de modais e componentes

### Padrão de Uso

```typescript
// Exemplo de uso de uma store
import { useWalletStore } from '@/store/useWalletStore';

function MyComponent() {
  const { activeWallet, setActiveWallet } = useWalletStore();
  // ...
}
```

## 🧭 Navegação

O aplicativo utiliza **Expo Router** com navegação híbrida:

### Estrutura de Navegação

1. **Stack Navigation** (raiz): Navegação principal
2. **Drawer Navigation**: Menu lateral com opções principais
3. **Tab Navigation**: Abas dentro do drawer (Home, Transações, Categorias, Anotações, Gráficos)

### Rotas Principais

- `/` - Tela inicial (redirecionamento baseado em carteira ativa)
- `/drawer/(tabs)/home` - Dashboard principal
- `/drawer/(tabs)/transaction` - Lista de transações
- `/drawer/(tabs)/category` - Gerenciamento de categorias
- `/drawer/(tabs)/anotation` - Anotações financeiras
- `/drawer/(tabs)/graphs` - Gráficos e visualizações
- `/drawer/wallets` - Seleção e gerenciamento de carteiras
- `/new-wallet` - Criação de nova carteira
- `/income` - Adicionar receita
- `/expense` - Adicionar despesa
- `/create-category` - Criar categoria

## 🎨 Estilização

### NativeWind (Tailwind CSS)

O projeto utiliza **NativeWind v4** para estilização com Tailwind CSS.

**Configuração**: `tailwind.config.js`

**Tema**: Suporte a modo claro/escuro com variáveis CSS customizadas definidas em `global.css`.

### Sistema de Cores

O tema utiliza variáveis HSL para cores, permitindo fácil customização:

- `--background`: Cor de fundo
- `--foreground`: Cor do texto
- `--primary`: Cor primária
- `--secondary`: Cor secundária
- `--muted`: Cores suaves
- `--accent`: Cor de destaque
- `--destructive`: Cor para ações destrutivas

### Componentes UI

Componentes base em `components/ui/` seguem o padrão **shadcn/ui** adaptado para React Native.

## 🚢 Build e Deploy

### EAS Build

O projeto está configurado para usar **Expo Application Services (EAS)** para builds.

#### Configurações de Build

Arquivo: `eas.json`

- **Development**: Build para desenvolvimento com development client
- **Preview**: Build para testes internos
- **Production**: Build para produção com auto-incremento de versão

#### Comandos EAS

```bash
# Build para desenvolvimento
eas build --profile development --platform android

# Build para preview
eas build --profile preview --platform android

# Build para produção
eas build --profile production --platform android

# Build iOS (requer conta Apple Developer)
eas build --profile production --platform ios
```

### Configurações de Plataforma

#### Android
- **Package**: `com.m4rlon_b4rreto.mywallet`
- **Edge to Edge**: Habilitado
- **Build Type**: App Bundle (produção)

#### iOS
- **Bundle Identifier**: `com.marlon.mywallet`
- **Supports Tablet**: Sim
- **New Architecture**: Habilitada

## ⚙️ Configurações

### TypeScript

- **Strict Mode**: Habilitado
- **Path Aliases**: `@/*` aponta para raiz do projeto
- **Base Config**: Estende `expo/tsconfig.base`

### Expo

- **New Architecture**: Habilitada (`newArchEnabled: true`)
- **Edge to Edge**: Habilitado no Android
- **Typed Routes**: Habilitado (experimental)
- **Orientation**: Portrait apenas

### Metro Bundler

Configurado em `metro.config.js` para suportar NativeWind e assets.

### Babel

Configurado em `babel.config.js` com plugin NativeWind.

## 📱 Funcionalidades Principais

- ✅ Gerenciamento de múltiplas carteiras
- ✅ Registro de receitas e despesas
- ✅ Sistema de categorias personalizáveis
- ✅ Anotações financeiras com itens
- ✅ Visualizações gráficas de gastos
- ✅ Armazenamento local (offline-first)
- ✅ Interface moderna com suporte a tema claro/escuro
- ✅ Navegação intuitiva com drawer e tabs

## 🔒 Segurança e Privacidade

- **Armazenamento Local**: Todos os dados são armazenados localmente no dispositivo
- **Sem Backend**: Aplicativo funciona completamente offline
- **Sem Coleta de Dados**: Nenhum dado é enviado para servidores externos

## 📄 Licença

Este projeto é privado.

## 👥 Contribuição

Este é um projeto privado. Para questões ou sugestões, entre em contato com os mantenedores.

---

**Desenvolvido com ❤️ usando React Native e Expo**
