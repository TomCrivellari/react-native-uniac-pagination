import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors, fontWeights } from '../theme';
import TelaTemporaria from './TelaTemporaria';

const Tab = createBottomTabNavigator();

// Ícone (normal / selecionado) de cada aba
const icones = {
  Home: ['home-outline', 'home'],
  Busca: ['search-outline', 'search'],
  Carrinho: ['cart-outline', 'cart'],
  Pedidos: ['receipt-outline', 'receipt'],
  Perfil: ['person-outline', 'person'],
};

/**
 * Abas principais do app (área logada). Ficam dentro da tela "Home" do menu lateral (AppDrawer).
 *
 * Para entregar a sua tela: troque o `component` da aba pela tela nova.
 */
export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, // o cabeçalho (com o botão do menu lateral) é do Drawer
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontWeight: fontWeights.medium },
        tabBarIcon: ({ focused, color, size }) => {
          const [normal, selecionado] = icones[route.name];
          return <Ionicons name={focused ? selecionado : normal} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Busca" component={PlaceholderScreen} options={{ title: 'Buscar' }} />
      <Tab.Screen
        name="Carrinho"
        component={TelaTemporaria}
        initialParams={{
          titulo: 'Carrinho',
          atalhos: [{ texto: 'Ir para o Checkout', destino: 'Checkout' }],
        }}
      />
      <Tab.Screen
        name="Pedidos"
        component={PlaceholderScreen}
        options={{ title: 'Meus pedidos' }}
      />
      <Tab.Screen
        name="Perfil"
        component={TelaTemporaria}
        initialParams={{
          titulo: 'Perfil',
          atalhos: [{ texto: 'Sair', destino: 'Login', reset: true }],
        }}
      />
    </Tab.Navigator>
  );
}