import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckoutScreen from '../screens/CheckoutScreen';
import ConfirmacaoScreen from '../screens/ConfirmacaoScreen';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';

import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors, fontWeights } from '../theme';
import AppDrawer from './AppDrawer';
import TelaTemporaria from './TelaTemporaria';

const Stack = createNativeStackNavigator();

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
        component={SplashScreen}
        options={{ headerShown: false, statusBarStyle: 'dark' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
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
      <Stack.Screen name="App" component={AppDrawer} options={{ headerShown: false }} />

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