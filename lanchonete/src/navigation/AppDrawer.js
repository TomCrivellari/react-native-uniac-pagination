import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import DrawerContent from '../components/DrawerContent';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors, fontWeights } from '../theme';
import MainTabs from './MainTabs';

const Drawer = createDrawerNavigator();

// Título do cabeçalho conforme a aba aberta dentro da tela Home
const titulosAbas = {
  Home: 'Início',
  Busca: 'Buscar',
  Carrinho: 'Carrinho',
  Pedidos: 'Meus pedidos',
  Perfil: 'Perfil',
};

function icone(nome) {
  return ({ color, size }) => <Ionicons name={nome} color={color} size={size} />;
}

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: { fontWeight: fontWeights.bold },
        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: colors.background,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={({ route }) => ({
          title: titulosAbas[getFocusedRouteNameFromRoute(route) ?? 'Home'],
          drawerIcon: icone('home-outline'),
        })}
      />

      {/* Telas ainda em desenvolvimento: quem terminar a sua troca o PlaceholderScreen pela tela nova */}
      <Drawer.Screen
        name="Menu"
        component={PlaceholderScreen}
        options={{ title: 'Cardápio', drawerIcon: icone('fast-food-outline') }}
      />
      <Drawer.Screen
        name="Search"
        component={PlaceholderScreen}
        options={{ title: 'Buscar', drawerIcon: icone('search-outline') }}
      />
      <Drawer.Screen
        name="Cart"
        component={CarrinhoScreen}
        options={{ title: 'Carrinho', drawerIcon: icone('cart-outline') }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'Carrinho' });
          },
        })}
      />
      <Drawer.Screen
        name="Orders"
        component={PlaceholderScreen}
        options={{ title: 'Meus pedidos', drawerIcon: icone('receipt-outline') }}
      />
      <Drawer.Screen
        name="Profile"
        component={PlaceholderScreen}
        options={{ title: 'Perfil', drawerIcon: icone('person-outline') }}
      />
    </Drawer.Navigator>
  );
}