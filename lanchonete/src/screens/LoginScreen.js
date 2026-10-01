import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSizes, fontWeights, radius, spacing } from '../theme';
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
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  // Os erros só aparecem depois da primeira tentativa de entrar
  const [tentouEntrar, setTentouEntrar] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [campoEmFoco, setCampoEmFoco] = useState(null);

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
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[
              styles.input,
              styles.inputSemContorno,
              campoEmFoco === 'email' && styles.inputFocused,
              erroEmail && styles.inputError,
            ]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setCampoEmFoco('email')}
            onBlur={() => setCampoEmFoco(null)}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={colors.textSecondary}
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
          {erroEmail && <Text style={styles.errorText}>{erroEmail}</Text>}

          <Text style={[styles.label, styles.labelSpacing]}>Senha</Text>
          <View
            style={[
              styles.input,
              styles.passwordRow,
              campoEmFoco === 'senha' && styles.inputFocused,
              erroSenha && styles.inputError,
            ]}
          >
            <TextInput
              ref={campoSenha}
              style={[styles.passwordInput, styles.inputSemContorno]}
              value={senha}
              onChangeText={setSenha}
              onFocus={() => setCampoEmFoco('senha')}
              onBlur={() => setCampoEmFoco(null)}
              placeholder="Sua senha"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!senhaVisivel}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={entrar}
              editable={!entrando}
            />
            <Pressable
              onPress={() => setSenhaVisivel(!senhaVisivel)}
              hitSlop={spacing.sm}
              accessibilityRole="button"
              accessibilityLabel={senhaVisivel ? 'Esconder senha' : 'Mostrar senha'}
            >
              <Ionicons
                name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={fontSizes.lg}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
          {erroSenha && <Text style={styles.errorText}>{erroSenha}</Text>}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              entrando && styles.buttonDisabled,
            ]}
            onPress={entrar}
            disabled={entrando}
            accessibilityRole="button"
          >
            {entrando ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

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
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  labelSpacing: {
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  // No navegador, o foco é mostrado pela borda (inputFocused) em vez do contorno padrão
  inputSemContorno: {
    outlineStyle: 'none',
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  passwordInput: {
    flex: 1,
    padding: 0,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textOnPrimary,
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
