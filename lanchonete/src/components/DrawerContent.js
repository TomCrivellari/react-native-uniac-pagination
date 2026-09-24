import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSizes, fontWeights, spacing } from '../theme';

const tamanhoLogo = 120;

export default function DrawerContent(props) {
  const insets = useSafeAreaInsets();
  const aberto = useDrawerStatus() === 'open';

  function sair() {
    // TODO: voltar para a tela de Login quando ela existir
    props.navigation.closeDrawer();
  }

  return (
    <View style={styles.container}>
      {/* Menu aberto deixa o topo claro (ícones escuros); fechado, o cabeçalho vermelho pede ícones claros */}
      <StatusBar style={aberto ? 'dark' : 'light'} />

      <View style={[styles.brand, { paddingTop: insets.top + spacing.lg }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          accessibilityLabel="O Fomegão"
        />
        <Text style={styles.brandSubtitle}>O que vai ser hoje?</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.items}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <DrawerItem
          label="Sair"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          )}
          inactiveTintColor={colors.textSecondary}
          onPress={sair}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brand: {
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  logo: {
    width: tamanhoLogo,
    height: tamanhoLogo,
  },
  brandSubtitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  items: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingStart: spacing.sm,
    paddingEnd: spacing.sm,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingStart: spacing.sm,
    paddingEnd: spacing.sm,
  },
});
