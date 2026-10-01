import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fontWeights, spacing } from '../theme';

const tamanhoLogo = 200;
const duracaoAnimacao = 800;
const tempoNaTela = 2000;

export default function SplashScreen({ navigation }) {
  const opacidade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacidade, {
      toValue: 1,
      duration: duracaoAnimacao,
      useNativeDriver: true,
    }).start();

    // reset tira a Splash do histórico: o botão "voltar" não retorna para ela
    const timer = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, tempoNaTela);

    return () => clearTimeout(timer);
  }, [navigation, opacidade]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View style={[styles.brand, { opacity: opacidade }]}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          accessibilityLabel="O Fomegão"
        />
        <Text style={styles.slogan}>Bateu a fome? A gente resolve.</Text>
      </Animated.View>

      <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
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
  brand: {
    alignItems: 'center',
  },
  logo: {
    width: tamanhoLogo,
    height: tamanhoLogo,
  },
  slogan: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  loading: {
    marginTop: spacing.xl,
  },
});
