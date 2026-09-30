import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckoutScreen from '../screens/CheckoutScreen';
import ConfirmacaoScreen from '../screens/ConfirmacaoScreen';

import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors, fontWeights } from '../theme';
import AppDrawer from './AppDrawer';
import TelaTemporaria from './TelaTemporaria';

const Stack = createNativeStackNavigator();

/**
 * Navegador principal (Stack).
 *
 * Rotas e quem é responsável:
 *  - Splash          -> Antonio   (depois de ~2s: navigation.replace('Login'))
 *  - Login           -> Antonio   (login ok: navigation.replace('Main'))
 *  - Cadastro        -> Gabriel Vieira
 *  - Main            -> menu lateral (AppDrawer.js) com as abas (MainTabs.js) na tela Home
 *  - ListaProdutos   -> Mateus    (recebe params: { categoria })
 *  - DetalhesProduto -> Santiago  (recebe params: { produto })
 *  - Checkout        -> Gabriel Viana
 *  - Confirmacao     -> Gabriel Viana
 *
 * Para entregar a sua tela: troque o `component` da rota pela tela nova.
 *
 * Use `replace` (e não `navigate`) ao sair de Splash/Login, para o botão "voltar"
 * do celular não levar o usuário de volta para essas telas.
 */
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: { fontWeight: fontWeights.bold },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
        statusBarStyle: 'light',
      }}
    >
      {/* Fluxo de entrada: sem cabeçalho e com barra de status escura (fundo claro) */}
      <Stack.Screen
        name="Splash"
        component={TelaTemporaria}
        initialParams={{
          titulo: 'Splash',
          atalhos: [{ texto: 'Ir para o Login', destino: 'Login' }],
        }}
        options={{ headerShown: false, statusBarStyle: 'dark' }}
      />
      <Stack.Screen
        name="Login"
        component={TelaTemporaria}
        initialParams={{
          titulo: 'Login',
          atalhos: [
            { texto: 'Entrar', destino: 'Main', reset: true },
            { texto: 'Criar conta', destino: 'Cadastro' },
          ],
        }}
        options={{ headerShown: false, statusBarStyle: 'dark' }}
      />
      <Stack.Screen
        name="Cadastro"
        component={TelaTemporaria}
        initialParams={{
          titulo: 'Cadastro',
          atalhos: [{ texto: 'Voltar ao Login', destino: 'Login', reset: true }],
        }}
        options={{ title: 'Criar conta' }}
      />

      {/* Área logada: menu lateral (Drawer), que tem as abas dentro da tela Home */}
      <Stack.Screen name="Main" component={AppDrawer} options={{ headerShown: false }} />

      {/* Telas que abrem por cima das abas */}
      <Stack.Screen
        name="ListaProdutos"
        component={PlaceholderScreen}
        options={({ route }) => ({ title: route.params?.categoria ?? 'Produtos' })}
      />
      <Stack.Screen
        name="DetalhesProduto"
        component={PlaceholderScreen}
        options={{ title: 'Detalhes' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Finalizar pedido' }}
      />
        <Stack.Screen
        name="Confirmacao"
        component={ConfirmacaoScreen}
        options={{
          title: 'Pedido confirmado',
          headerBackVisible: false,
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}