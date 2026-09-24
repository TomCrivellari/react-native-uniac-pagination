import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerContent from '../components/DrawerContent';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors, fontWeights } from '../theme';

const Drawer = createDrawerNavigator();

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
        component={HomeScreen}
        options={{ title: 'Início', drawerIcon: icone('home-outline') }}
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
        component={PlaceholderScreen}
        options={{ title: 'Carrinho', drawerIcon: icone('cart-outline') }}
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
