import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useCart } from '../context/CartContext';
import { useTema } from '../context/TemaContext';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import PerfilScreen from '../screens/PerfilScreen';
import PedidosScreen from '../screens/PedidosScreen';
import { fontWeights } from '../theme';
import { abaInicial, iconeDaAba, tituloDaAba } from './abas';

const Tab = createBottomTabNavigator();

/**
 * Abas principais do app (área logada). Ficam dentro do menu lateral (AppDrawer), que também
 * leva a elas: os dois menus usam a mesma lista de abas (abas.js).
 *
 * Para entregar a sua tela: troque o `component` da aba pela tela nova.
 */
export default function MainTabs() {
  const { colors } = useTema();
  const { quantidadeTotal } = useCart();

  return (
    <Tab.Navigator
      initialRouteName={abaInicial}
      screenOptions={({ route }) => ({
        headerShown: false, // o cabeçalho (com o botão do menu lateral) é do Drawer
        title: tituloDaAba(route.name),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontWeight: fontWeights.medium },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={iconeDaAba(route.name, focused)} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Busca" component={MenuScreen} />
      <Tab.Screen
        name="Carrinho"
        component={CarrinhoScreen}
        options={{ tabBarBadge: quantidadeTotal > 0 ? quantidadeTotal : undefined }}
      />
      <Tab.Screen name="Pedidos" component={PedidosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}