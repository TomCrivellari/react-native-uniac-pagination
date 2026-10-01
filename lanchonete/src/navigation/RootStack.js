import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppDrawer from './AppDrawer';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

// Fluxo principal: Splash -> Login -> App (menu lateral com as telas da lanchonete)
export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="App" component={AppDrawer} />
    </Stack.Navigator>
  );
}
