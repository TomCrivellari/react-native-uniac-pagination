import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Input from '../components/Input';
import { colors, fontSizes, fontWeights, spacing } from '../theme';
import {
  validarConfirmacaoSenha,
  validarEmail,
  validarNome,
  validarSenha,
} from '../utils/validacao';

const tempoCadastrando = 800;

export default function CadastroScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const campoEmail = useRef(null);
  const campoSenha = useRef(null);
  const campoConfirmacao = useRef(null);
  const timerCadastro = useRef(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');

  const [tentouCadastrar, setTentouCadastrar] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);

  const erroNome = tentouCadastrar ? validarNome(nome) : null;
  const erroEmail = tentouCadastrar ? validarEmail(email) : null;
  const erroSenha = tentouCadastrar ? validarSenha(senha) : null;
  const erroConfirmacao = tentouCadastrar ? validarConfirmacaoSenha(senha, confirmacao) : null;

  useEffect(() => () => clearTimeout(timerCadastro.current), []);

  function cadastrar() {
    setTentouCadastrar(true);

    if (
      validarNome(nome) ||
      validarEmail(email) ||
      validarSenha(senha) ||
      validarConfirmacaoSenha(senha, confirmacao)
    ) {
      return;
    }

    setCadastrando(true);
    timerCadastro.current = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
    }, tempoCadastrando);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: spacing.lg, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.title}>Crie a sua conta</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo para fazer o seu pedido.</Text>

          <Input
            label="Nome"
            value={nome}
            onChangeText={setNome}
            erro={erroNome}
            placeholder="Seu nome completo"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => campoEmail.current?.focus()}
            submitBehavior="submit"
            editable={!cadastrando}
          />

          <Input
            ref={campoEmail}
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            erro={erroEmail}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => campoSenha.current?.focus()}
            submitBehavior="submit"
            editable={!cadastrando}
          />

          <Input
            ref={campoSenha}
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            erro={erroSenha}
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => campoConfirmacao.current?.focus()}
            submitBehavior="submit"
            editable={!cadastrando}
          />

          <Input
            ref={campoConfirmacao}
            label="Confirmar senha"
            value={confirmacao}
            onChangeText={setConfirmacao}
            erro={erroConfirmacao}
            placeholder="Digite a senha novamente"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={cadastrar}
            editable={!cadastrando}
          />

          <Button
            titulo="Criar conta"
            onPress={cadastrar}
            carregando={cadastrando}
            style={styles.botao}
          />

          <View style={styles.login}>
            <Text style={styles.loginTexto}>Já tem conta?</Text>
            <Button
              titulo="Voltar ao Login"
              variante="secundario"
              onPress={() => navigation.goBack()}
              desabilitado={cadastrando}
              style={styles.botaoLogin}
            />
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
    paddingHorizontal: spacing.lg,
  },
  form: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  botao: {
    marginTop: spacing.sm,
  },
  login: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  loginTexto: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  botaoLogin: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
});