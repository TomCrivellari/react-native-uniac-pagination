import { useAuth } from '../context/AuthContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

import { fontSizes, fontWeights, spacing } from '../theme';

const tamanhoLogo = 200;
const duracaoAnimacao = 800;
const tempoNaTela = 2000;

export default function SplashScreen({ navigation }) {
  const { colors, escuro } = useTema();
  const styles = useEstilos(criarEstilos);
  const opacidade = useRef(new Animated.Value(0)).current;
  const { usuario, carregando } = useAuth();
  const [tempoAcabou, setTempoAcabou] = useState(false);

  useEffect(() => {
    Animated.timing(opacidade, {
      toValue: 1,
      duration: duracaoAnimacao,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => setTempoAcabou(true), tempoNaTela);
    return () => clearTimeout(timer);
  }, [opacidade]);

  // Só sai da Splash quando o tempo passou e o firebase já disse se tem alguém logado.
  // Quem já entrou antes vai direto pro app
  useEffect(() => {
    if (tempoAcabou && !carregando) {
      // reset tira a Splash do histórico: o botão "voltar" não retorna para ela
      navigation.reset({ index: 0, routes: [{ name: usuario ? 'App' : 'Login' }] });
    }
  }, [tempoAcabou, carregando, usuario, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style={escuro ? 'light' : 'dark'} />

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

function criarEstilos(colors) {
  return StyleSheet.create({
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
}
