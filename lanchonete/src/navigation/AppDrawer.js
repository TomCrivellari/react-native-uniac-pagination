import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import DrawerContent from '../components/DrawerContent';
import { colors, fontWeights } from '../theme';
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
        name="Abas"
        component={MainTabs}
        options={({ route }) => ({
          title: tituloDaAba(getFocusedRouteNameFromRoute(route) ?? abaInicial),
        })}
      />
    </Drawer.Navigator>
  );
}
