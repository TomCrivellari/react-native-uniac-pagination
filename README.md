# Lanchonete

Aplicativo mobile para uma lanchonete, desenvolvido em grupo como trabalho acadêmico com **React Native** e **Expo**.

> O aplicativo fica na pasta [`lanchonete/`](lanchonete/). Todos os comandos do projeto (`npm install`, `npm start`...) devem ser executados **dentro dela**.

## Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (template *blank*, JavaScript)
- Git + GitHub para trabalho em grupo

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS) e npm
- [Git](https://git-scm.com/)
- Um celular com o app **Expo Go** instalado (Android ou iOS) **ou** um emulador Android configurado

## Como rodar o projeto

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd react-native-uniac-pagination

# 2. Instale as dependências
cd lanchonete
npm install

# 3. Inicie o app
npm start
```

Depois de `npm start`, escaneie o QR Code com o Expo Go (celular e computador na **mesma rede Wi-Fi**) ou use os atalhos abaixo:

| Comando           | O que faz                          |
| ----------------- | ---------------------------------- |
| `npm start`       | Abre o servidor de desenvolvimento |
| `npm run android` | Abre no emulador Android           |
| `npm run ios`     | Abre no simulador iOS (só macOS)   |
| `npm run web`     | Abre no navegador                  |

## Estrutura do projeto

```
lanchonete/
├── App.js              # Ponto de entrada do app
├── app.json            # Configurações do Expo
├── assets/             # Imagens, ícones e fontes
└── src/
    ├── screens/        # Telas do app (uma por arquivo)
    ├── components/     # Componentes reutilizáveis (botões, cards...)
    ├── navigation/     # Navegadores (menu lateral / drawer)
    ├── context/        # Estado global (React Context)
    ├── data/           # Dados estáticos / mockados (ex.: cardápio)
    └── theme/          # Design system: cores, tipografia, espaçamentos
```

## Tema (design system)

Cores, tamanhos de fonte e espaçamentos ficam centralizados em `src/theme/`. **Não escreva valores fixos** (`'#E63946'`, `16`...) direto nos componentes: use o tema, assim o visual fica consistente e uma mudança de cor é feita em um lugar só.

```js
import { colors, fontSizes, fontWeights, spacing, radius } from '../theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
});
```

| Arquivo         | Conteúdo                                                  |
| --------------- | --------------------------------------------------------- |
| `colors.js`     | Paleta (primária, secundária, fundo, texto, erro...)      |
| `typography.js` | Tamanhos (`xs` a `xxl`) e pesos de fonte                  |
| `spacing.js`    | Espaçamentos (`xs` a `xl`) e raios de borda               |
| `index.js`      | Reexporta tudo, além do objeto `theme`                    |

## Como trabalhar em grupo

### Regra de ouro

**Ninguém faz commit direto na `main`.** Cada tarefa é feita em uma branch própria e entra na `main` por Pull Request.

### Fluxo de trabalho

```bash
# 1. Atualize a main antes de começar
git checkout main
git pull

# 2. Crie uma branch para a sua tarefa
git checkout -b feat/tela-cardapio

# 3. Trabalhe, e faça commits pequenos e frequentes
git add .
git commit -m "feat: adiciona lista de produtos na tela de cardápio"

# 4. Envie a branch
git push -u origin feat/tela-cardapio
```

5. Abra um **Pull Request** no GitHub apontando para `main`.
6. Peça a revisão de pelo menos um colega.
7. Depois de aprovado, faça o merge e apague a branch.

### Nome das branches

Use o formato `tipo/descricao-curta`, em minúsculas e com hífens:

| Prefixo     | Quando usar                        | Exemplo                    |
| ----------- | ---------------------------------- | -------------------------- |
| `feat/`     | Nova funcionalidade ou tela        | `feat/carrinho`            |
| `fix/`      | Correção de bug                    | `fix/preco-nao-atualiza`   |
| `style/`    | Ajustes visuais / tema             | `style/cores-botao`        |
| `docs/`     | Documentação                       | `docs/atualiza-readme`     |
| `chore/`    | Configuração, dependências, setup  | `chore/instala-navigation` |
| `refactor/` | Reorganização sem mudar o comportamento | `refactor/context-pedido` |

### Mensagens de commit

Comece com o mesmo tipo da branch, seguido de uma frase curta no imperativo:

```
feat: adiciona tela de detalhes do produto
fix: corrige soma do total do carrinho
style: ajusta espaçamento dos cards
docs: descreve estrutura de pastas no README
chore: instala o React Navigation
```

### Evitando conflitos

- Divida as tarefas antes de começar, para duas pessoas não mexerem no mesmo arquivo ao mesmo tempo.
- **Uma tela por arquivo** em `src/screens/`: cada pessoa trabalha na sua.
- Antes de abrir o PR, traga as novidades da `main` para a sua branch:
  ```bash
  git checkout main
  git pull
  git checkout sua-branch
  git merge main
  ```
- Se houver conflito, resolva com calma e teste o app antes de continuar. Em caso de dúvida, peça ajuda ao grupo em vez de sobrescrever o código de alguém.
- Não altere `package.json`, `app.json` ou o tema sem avisar o grupo: essas mudanças afetam todo mundo.

### Dependências

Para instalar uma biblioteca nova, use **`npx expo install <pacote>`** (e não `npm install`), pois assim o Expo escolhe a versão compatível. Depois de um `git pull` que mude o `package.json`, rode `npm install` de novo.

## Convenções de código

- Componentes e telas: nome em `PascalCase` e um por arquivo (`ProductCard.js`, `MenuScreen.js`).
- Variáveis e funções: `camelCase`.
- Estilos com `StyleSheet.create` no final do arquivo, usando os valores do tema.
- Textos e comentários em português.

## Integrantes

| Nome                                   | Responsabilidade                                                  |
| -------------------------------------- | ----------------------------------------------------------------- |
| Antonio Martins Tarchi Crivellari      | Setup do projeto, tema e repositório; telas Splash e Login        |
| Santiago da Silva Rodrigues            | Dados dos produtos (`produtos.js`); tela de Detalhes do produto   |
| Guilherme Batista                      | `CartContext` (estado do carrinho); tela de Carrinho              |
| Gabriel Viana de Farias                | Navegação (Stack e Bottom Tabs); telas de Checkout e Confirmação  |
| Gabriel Vieira Portes                  | Componentes `Button` e `Input`; telas de Cadastro e Perfil        |
| Mateus Guilherme Xavier Barbosa        | Componente `ProductCard`; telas Home e Lista de produtos          |
| João Victor Sobreira de Almeida        | Componente `Header`; telas de Busca e Meus pedidos                |
