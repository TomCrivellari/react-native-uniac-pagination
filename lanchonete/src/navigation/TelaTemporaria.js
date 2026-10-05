import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import { colors, fontSizes, fontWeights, spacing } from '../theme';

/**
 * Tela provisória usada enquanto a tela real de cada colega não entra na main.
 * Mostra o nome da tela e atalhos para navegar, assim dá para testar o fluxo inteiro.
 *
 * Quem terminar a sua tela troca o `component` no RootNavigator / MainTabs
 * e esta tela deixa de ser usada naquela rota.
 *
 * Parâmetros (via initialParams):
 *  - titulo: nome mostrado na tela
 *  - atalhos: [{ texto, destino, reset }]  (reset: true zera o histórico de navegação)
 */
export default function TelaTemporaria({ navigation, route }) {
  const { titulo, atalhos = [] } = route.params ?? {};

  function ir({ destino, reset }) {
    if (reset) {
      let alvo = navigation;
      while (alvo.getParent() && !alvo.getState().routeNames.includes(destino)) {
        alvo = alvo.getParent();
      }
      alvo.reset({ index: 0, routes: [{ name: destino }] });
    } else {
      navigation.navigate(destino);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titulo ?? route.name}</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento pelo grupo.</Text>

      {atalhos.map((atalho) => (
        <Button
          key={atalho.texto}
          titulo={atalho.texto}
          onPress={() => ir(atalho)}
          style={styles.botao}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  botao: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
});