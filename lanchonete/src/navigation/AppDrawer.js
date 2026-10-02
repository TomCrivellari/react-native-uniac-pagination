import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import DrawerContent from '../components/DrawerContent';
import { colors, fontWeights } from '../theme';
import MenuScreen from '../screens/MenuScreen.js';
import { abaInicial, tituloDaAba } from './abas';
import MainTabs from './MainTabs';

const Drawer = createDrawerNavigator();

/**
 * Menu lateral da área logada. Ele tem uma tela só (as abas): os itens do menu não são telas
 * próprias, eles trocam a aba aberta. Assim a barra de abas continua visível e os dois menus
 * sempre marcam o mesmo destino. Os itens ficam no DrawerContent.
 */
export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: { fontWeight: fontWeights.bold },
        drawerStyle: { backgroundColor: colors.surface },
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
        component={MenuScreen}
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
        name="Abas"
        component={MainTabs}
        options={({ route }) => ({
          title: tituloDaAba(getFocusedRouteNameFromRoute(route) ?? abaInicial),
        })}
      />
    </Drawer.Navigator>
  );
}
