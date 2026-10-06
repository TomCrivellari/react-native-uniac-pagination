import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { fontSizes, fontWeights, radius, spacing } from '../theme';
import { validarEmail, validarSenha } from '../utils/validacao';

const tamanhoLogo = 140;
const tempoEntrando = 800;

function avisar(titulo, mensagem) {
  // Alert.alert não aparece no navegador, então no web usamos o alert do próprio navegador
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export default function LoginScreen({ navigation, route }) {
  const { colors, escuro } = useTema();
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const campoSenha = useRef(null);
  const timerEntrada = useRef(null);
  const { fazerLogin } = useAuth();
  // Vem do Cadastro quando a conta acabou de ser criada
  const emailCriado = route.params?.emailCriado;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Os erros só aparecem depois da primeira tentativa de entrar
  const [tentouEntrar, setTentouEntrar] = useState(false);
  const [entrando, setEntrando] = useState(false);
  // Conta não encontrada ou senha errada: { campo: 'email' | 'senha', mensagem }
  const [erroConta, setErroConta] = useState(null);

  const erroEmail =
    (tentouEntrar ? validarEmail(email) : null) ??
    (erroConta?.campo === 'email' ? erroConta.mensagem : null);
  const erroSenha =
    (tentouEntrar ? validarSenha(senha) : null) ??
    (erroConta?.campo === 'senha' ? erroConta.mensagem : null);

  useEffect(() => () => clearTimeout(timerEntrada.current), []);

  // Conta recém-criada: já deixa o e-mail preenchido e o cursor na senha
  useEffect(() => {
    if (emailCriado) {
      setEmail(emailCriado);
      setSenha('');
      setTentouEntrar(false);
      setErroConta(null);
      campoSenha.current?.focus();
    }
  }, [emailCriado]);

  function alterarEmail(texto) {
    setEmail(texto);
    setErroConta(null);
  }

  function alterarSenha(texto) {
    setSenha(texto);
    setErroConta(null);
  }

  function entrar() {
    setTentouEntrar(true);

    if (validarEmail(email) || validarSenha(senha)) {
      return;
    }

    const erro = fazerLogin(email, senha);
    if (erro) {
      setErroConta(erro);
      return;
    }

    setEntrando(true);
    timerEntrada.current = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
    }, tempoEntrando);
  }

  function criarConta() {
    navigation.navigate('Cadastro');
  } 

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style={escuro ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            accessibilityLabel="O Fomegão"
          />
          <Text style={styles.title}>Que bom te ver!</Text>
          <Text style={styles.subtitle}>Entre na sua conta para fazer o pedido.</Text>
        </View>

        <View style={styles.form}>
          {emailCriado && (
            <View style={styles.aviso}>
              <Ionicons name="checkmark-circle" size={fontSizes.lg} color={colors.success} />
              <Text style={styles.avisoTexto}>Conta criada! Agora entre com a sua senha.</Text>
            </View>
          )}

          <Input
            label="E-mail"
            erro={erroEmail}
            value={email}
            onChangeText={alterarEmail}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => campoSenha.current?.focus()}
            submitBehavior="submit"
            editable={!entrando}
          />

          <Input
            ref={campoSenha}
            label="Senha"
            erro={erroSenha}
            secureTextEntry
            value={senha}
            onChangeText={alterarSenha}
            placeholder="Sua senha"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={entrar}
            editable={!entrando}
          />

          <Button
            titulo="Entrar"
            onPress={entrar}
            carregando={entrando}
            style={styles.botaoEntrar}
          />

          <View style={styles.signup}>
            <Text style={styles.signupText}>Ainda não tem conta? </Text>
            <Pressable onPress={criarConta} disabled={entrando} accessibilityRole="link">
              <Text style={styles.signupLink}>Criar conta</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    brand: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    logo: {
      width: tamanhoLogo,
      height: tamanhoLogo,
    },
    title: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.primary,
      marginTop: spacing.md,
    },
    subtitle: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    form: {
      width: '100%',
      maxWidth: 420,
      alignSelf: 'center',
    },
    aviso: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.success,
      borderRadius: radius.md,
      padding: spacing.sm + spacing.xs,
      marginBottom: spacing.md,
    },
    avisoTexto: {
      flex: 1,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.success,
    },
    // Somado ao marginBottom do Input, fica spacing.lg entre a senha e o botão
    botaoEntrar: {
      marginTop: spacing.sm,
    },
    signup: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: spacing.lg,
    },
    signupText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
    },
    signupLink: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.bold,
      color: colors.primary,
    },
  });
}
