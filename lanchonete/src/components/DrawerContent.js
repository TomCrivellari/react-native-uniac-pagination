import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, useDrawerStatus } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Image, Platform, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { abaInicial, abas, iconeDaAba } from '../navigation/abas';
import { fontSizes, fontWeights, radius, spacing } from '../theme';

const tamanhoLogo = 120;

// Itens do menu que não são abas: abrem uma tela por cima das abas (com botão de voltar)
const outrosItens = [{ titulo: 'Cardápio', icone: 'fast-food-outline', tela: 'ListaProdutos' }];

export default function DrawerContent({ navigation, state }) {
  const { colors, escuro, alternarTema } = useTema();
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const aberto = useDrawerStatus() === 'open';
  const { fonts } = useTheme();
  const { quantidadeTotal } = useCart();
  const { fazerLogout } = useAuth();

  const coresItem = {
    activeTintColor: colors.primary,
    activeBackgroundColor: colors.background,
    inactiveTintColor: colors.text,
  };

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
    fazerLogout();
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
      {/* Menu aberto: ícones escuros no topo claro (ou claros no tema escuro); fechado, o cabeçalho vermelho pede ícones claros */}
      <StatusBar style={aberto && !escuro ? 'dark' : 'light'} />

      <View style={[styles.brand, { paddingTop: insets.top + spacing.lg }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          accessibilityLabel="O Fomegão"
        />
        <Text style={styles.brandSubtitle}>O que vai ser hoje?</Text>
      </View>

      <DrawerContentScrollView contentContainerStyle={styles.items}>
        {abas.filter((aba) => aba.nome !== 'Busca').map((aba) => (
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

        {/* Troca o tema e deixa o menu aberto para ver a mudança */}
        <DrawerItem
          label={({ color }) => (
            <View style={styles.rotulo}>
              <Text style={[styles.rotuloTexto, fonts.medium, { color }]}>Tema escuro</Text>
              {/* Só a linha recebe o toque: na web, o clique na chave também chegaria na linha e trocaria duas vezes */}
              <View pointerEvents="none">
                <Switch
                  value={escuro}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.textOnPrimary}
                  // Na web, a bolinha ligada usa activeThumbColor (o padrão de lá é verde)
                  {...(Platform.OS === 'web' && { activeThumbColor: colors.textOnPrimary })}
                />
              </View>
            </View>
          )}
          icon={({ color, size }) => (
            <Ionicons name={escuro ? 'moon' : 'moon-outline'} color={color} size={size} />
          )}
          {...coresItem}
          accessibilityLabel={escuro ? 'Tema escuro, ligado' : 'Tema escuro, desligado'}
          onPress={alternarTema}
        />
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

function criarEstilos(colors) {
  return StyleSheet.create({
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
}
