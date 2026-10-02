import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
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
      }}
      // statusBarStyle do native-stack quebra no Expo Go (iOS), então a barra de status usa o expo-status-bar.
      // Telas com o cabeçalho vermelho pedem ícones claros; as sem cabeçalho cuidam da própria barra.
      screenLayout={({ options, children }) => (
        <>
          {options.headerShown !== false && <StatusBar style="light" />}
          {children}
        </>
      )}
    >
      {/* Fluxo de entrada: sem cabeçalho (cada tela define a própria barra de status) */}
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Cadastro"
        component={TelaTemporaria}
        initialParams={{
          titulo: 'Cadastro',
          atalhos: [{ texto: 'Voltar ao Login', destino: 'Login', reset: true }],
        }}
        options={{ title: 'Criar conta' }}
      />

      {/* Área logada: menu lateral (Drawer) com as abas dentro dele */}
      <Stack.Screen name="App" component={AppDrawer} options={{ headerShown: false }} />

      {/* Telas que abrem por cima das abas */}
      <Stack.Screen
        name="ListaProdutos"
        component={PlaceholderScreen}
        options={({ route }) => ({ title: route.params?.categoria ?? 'Cardápio' })}
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