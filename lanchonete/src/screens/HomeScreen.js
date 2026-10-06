import { useEstilos } from '../context/TemaContext';
import { Image, StyleSheet, Text, View } from 'react-native';

import { fontSizes, fontWeights, spacing } from '../theme';

const tamanhoLogo = 200;

export default function HomeScreen() {
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        accessibilityLabel="O Fomegão"
      />
      <Text style={styles.title}>Bem-vindo ao Fomegão!</Text>
      <Text style={styles.subtitle}>
        Navegue pelas abas abaixo ou pelo menu no canto superior esquerdo.
      </Text>
    </View>
  );
}

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
    },
    logo: {
      width: tamanhoLogo,
      height: tamanhoLogo,
    },
    title: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.primary,
      marginTop: spacing.lg,
    },
    subtitle: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
}
