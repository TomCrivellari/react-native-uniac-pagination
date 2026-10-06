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

Depois de `npm start`, escaneie o QR Code com o Expo Go (celular e computador na **mesma rede Wi-Fi**; veja o [passo a passo](#rodando-no-celular-com-o-expo-go)) ou use os atalhos abaixo:

| Comando             | O que faz                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `npm start`         | Abre o servidor de desenvolvimento                                                              |
| `npx expo start -c` | Abre o servidor **limpando o cache** (use depois de um `git pull` ou se o app parecer desatualizado) |
| `npm run android`   | Abre no emulador Android                                                                        |
| `npm run ios`       | Abre no simulador iOS (só macOS)                                                                |
| `npm run web`       | Abre no navegador                                                                               |

> Depois de trocar de branch ou fazer `git pull`, inicie com `npx expo start -c`. Sem limpar o cache, o Metro pode continuar mostrando telas e imagens antigas.

## Rodando no celular com o Expo Go

1. Instale o **Expo Go** no celular: [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779).
2. Conecte o celular e o computador na **mesma rede Wi-Fi**. Desligue os dados móveis (4G/5G) se o celular insistir em usá-los.
3. Se você estiver logado no Expo Go, faça login com a **mesma conta** no computador. Se não estiver logado no app, pule este passo.
   ```bash
   npx expo login     # pede usuário e senha da conta Expo
   npx expo whoami    # confere com qual conta o CLI está logado
   ```
4. Dentro da pasta `lanchonete/`, inicie o servidor:
   ```bash
   npm start
   ```
5. Escaneie o QR Code que aparece no terminal:
   - **Android:** pelo próprio Expo Go (opção *Scan QR code*).
   - **iOS:** pela câmera do iPhone; toque no link que aparecer para abrir no Expo Go.
6. Aguarde o primeiro carregamento. Depois disso, cada arquivo salvo atualiza o app no celular automaticamente.

### Problemas comuns

| Erro / sintoma | Solução |
| --- | --- |
| *"You're signed in to Expo Go as ..., but not signed in to Expo CLI"* | Rode `npx expo login` no computador com a mesma conta do Expo Go, reinicie o `npm start` e toque em **Try again**. Outra opção é sair da conta no Expo Go ou iniciar com `npx expo start --offline`. |
| O app fica carregando para sempre ou dá *"Could not connect to development server"* | O celular não está alcançando o computador. Confira se os dois estão no mesmo Wi-Fi ou use `npx expo start --tunnel` (funciona em redes diferentes, inclusive 4G/5G). |
| Rede da faculdade ou Wi-Fi público bloqueia a conexão | Use `npx expo start --tunnel`. |
| Erro de versão incompatível do Expo Go | Atualize o Expo Go na loja de apps. |
| Algo estranho depois de um `git pull` | Rode `npm install` e inicie com cache limpo: `npx expo start -c`. |

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
    ├── context/        # Estado global (React Context): CartContext (carrinho), AuthContext (contas e usuário logado) e TemaContext (tema claro/escuro)
    ├── data/           # Dados estáticos / mockados (ex.: cardápio)
    └── theme/          # Design system: cores, tipografia, espaçamentos
```

## Contas e login (dados locais)

O app não tem back-end: as contas ficam só na memória do aparelho, no `AuthContext`.

1. Na tela de Login, toque em **Criar conta** e preencha nome, e-mail e senha.
2. Ao criar a conta, o app volta para o Login com o e-mail já preenchido.
3. Entre com a senha que você criou. O Login só aceita contas criadas no Cadastro: e-mail desconhecido ou senha errada mostram o erro no campo.
4. Na aba **Perfil** aparecem o nome e o e-mail da conta. **Sair** (no Perfil ou no menu lateral) volta ao Login.
5. Ainda no Perfil, cadastre seus endereços. Eles ficam guardados na conta (uma conta nova começa sem nenhum).
6. No **Checkout**, com "Entrega" marcado, escolha um dos endereços cadastrados ou marque **Outro endereço** para digitar. Sem endereços cadastrados, aparece o aviso "Nenhum endereço cadastrado para esta conta." e o campo de texto para digitar.

> As contas e os endereços somem ao recarregar o app ou fechar o Expo Go. Depois disso, é preciso criar a conta de novo. O carrinho também começa vazio: os itens entram pelo "+" do Cardápio.

Para usar nas telas: `const { usuario, enderecos, criarConta, fazerLogin, fazerLogout, adicionarEndereco, removerEndereco } = useAuth();`. `usuario` é `{ nome, email }` da conta logada, ou `null`. `enderecos` é a lista `{ id, apelido, rua, bairro }` dessa conta.

## Tema (design system)

Cores, tamanhos de fonte e espaçamentos ficam centralizados em `src/theme/`. **Não escreva valores fixos** (`'#E63946'`, `16`...) direto nos componentes: use o tema, assim o visual fica consistente e uma mudança de cor é feita em um lugar só.

O app tem **tema claro e escuro**: a troca fica no menu lateral, em **Tema escuro** (depois de Cardápio). O app sempre abre no claro e a escolha vale até recarregar. Por isso as cores **não** são importadas direto do tema: elas vêm do `TemaContext`, e os estilos são montados com as cores do tema atual.

```js
import { useEstilos, useTema } from '../context/TemaContext';
import { fontSizes, fontWeights, radius, spacing } from '../theme';

export default function MinhaTela() {
  const styles = useEstilos(criarEstilos); // estilos com as cores do tema atual
  const { colors } = useTema(); // só se precisar de cor fora dos estilos (ex.: ícones)

  return <Ionicons name="cart" color={colors.primary} />;
}

// Continua no fim do arquivo: o StyleSheet.create fica dentro desta função
function criarEstilos(colors) {
  return StyleSheet.create({
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
}
```

> A exportação `colors` de `../theme` ainda existe, mas é a paleta clara fixa: o que usar ela **não muda** com o tema escuro. Use sempre `useTema()` / `useEstilos()`.

| Arquivo                   | Conteúdo                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `colors.js`               | Paletas `coresClaras` e `coresEscuras` (primária, fundo, texto, erro...)           |
| `typography.js`           | Tamanhos (`xs` a `xxl`) e pesos de fonte                                           |
| `spacing.js`              | Espaçamentos (`xs` a `xl`) e raios de borda                                        |
| `index.js`                | Reexporta tudo, além do objeto `theme`                                             |
| `context/TemaContext.js`  | `useTema()` (`colors`, `escuro`, `alternarTema`) e `useEstilos(criarEstilos)`      |

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
