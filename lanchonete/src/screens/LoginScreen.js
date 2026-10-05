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
import { colors, fontSizes, fontWeights, spacing } from '../theme';
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

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const campoSenha = useRef(null);
  const timerEntrada = useRef(null);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Os erros só aparecem depois da primeira tentativa de entrar
  const [tentouEntrar, setTentouEntrar] = useState(false);
  const [entrando, setEntrando] = useState(false);

  const erroEmail = tentouEntrar ? validarEmail(email) : null;
  const erroSenha = tentouEntrar ? validarSenha(senha) : null;

  useEffect(() => () => clearTimeout(timerEntrada.current), []);

  function entrar() {
    setTentouEntrar(true);

    if (validarEmail(email) || validarSenha(senha)) {
      return;
    }

    setEntrando(true);
    timerEntrada.current = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
    }, tempoEntrando);
  }

  function criarConta() {
    avisar('Em breve', 'A tela de cadastro ainda está sendo feita pelo grupo.');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

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
          <Input
            label="E-mail"
            erro={erroEmail}
            value={email}
            onChangeText={setEmail}
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
            onChangeText={setSenha}
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

const styles = StyleSheet.create({
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
