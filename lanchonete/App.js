import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { TemaProvider } from './src/context/TemaContext';

import Navegacao from './src/navigation/Navegacao';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <TemaProvider>
        <AuthProvider>
          <CartProvider>
            <Navegacao />
          </CartProvider>
        </AuthProvider>
      </TemaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
