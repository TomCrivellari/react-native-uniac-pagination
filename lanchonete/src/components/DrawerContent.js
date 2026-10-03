import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, useDrawerStatus } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart } from '../context/CartContext';
import { abaInicial, abas, iconeDaAba } from '../navigation/abas';
import { colors, fontSizes, fontWeights, radius, spacing } from '../theme';

const tamanhoLogo = 120;

const coresItem = {
  activeTintColor: colors.primary,
  activeBackgroundColor: colors.background,
  inactiveTintColor: colors.text,
};

// Itens do menu que não são abas: abrem uma tela por cima das abas (com botão de voltar)
const outrosItens = [{ titulo: 'Cardápio', icone: 'fast-food-outline', tela: 'ListaProdutos' }];

export default function DrawerContent({ navigation, state }) {
  const insets = useSafeAreaInsets();
  const aberto = useDrawerStatus() === 'open';
  const { fonts } = useTheme();
  const { quantidadeTotal } = useCart();

  // O menu tem uma rota só (as abas); o item ativo é a aba aberta na barra de baixo
  const abaAtual = getFocusedRouteNameFromRoute(state.routes[state.index]) ?? abaInicial;

  // Ir para uma rota que já está aberta não fecha o menu sozinho, então fecha antes de navegar
  function abrirAba(nome) {
    navigation.closeDrawer();
    navigation.navigate('Abas', { screen: nome });
  }

  function abrirTela(nome) {
    navigation.closeDrawer();
    navigation.navigate(nome);
  }

  function sair() {
    // O Login fica no Stack principal, um nível acima do menu lateral
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  function rotulo(titulo, badge) {
    return ({ color }) => (
      <View style={styles.rotulo}>
        <Text style={[styles.rotuloTexto, fonts.medium, { color }]}>{titulo}</Text>
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{badge}</Text>
          </View>
        )}
      </View>
    );
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

      <DrawerContentScrollView contentContainerStyle={styles.items}>
        {abas.map((aba) => (
          <DrawerItem
            key={aba.nome}
            label={rotulo(aba.titulo, aba.nome === 'Carrinho' ? quantidadeTotal : 0)}
            icon={({ focused, color, size }) => (
              <Ionicons name={iconeDaAba(aba.nome, focused)} color={color} size={size} />
            )}
            focused={aba.nome === abaAtual}
            {...coresItem}
            onPress={() => abrirAba(aba.nome)}
          />
        ))}

        <View style={styles.divisor} />

        {outrosItens.map((item) => (
          <DrawerItem
            key={item.tela}
            label={rotulo(item.titulo)}
            icon={({ color, size }) => <Ionicons name={item.icone} color={color} size={size} />}
            {...coresItem}
            onPress={() => abrirTela(item.tela)}
          />
        ))}
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
  rotulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rotuloTexto: {
    lineHeight: 24,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minWidth: spacing.lg - spacing.xs,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  badgeTexto: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    lineHeight: spacing.lg - spacing.xs,
  },
  divisor: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingStart: spacing.sm,
    paddingEnd: spacing.sm,
  },
});
