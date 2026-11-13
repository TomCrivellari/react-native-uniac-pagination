import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { useCep } from '../hooks/useCep';
import { fontSizes, fontWeights, radius, spacing } from '../theme';

const tamanhoAvatar = 80;

// Primeira letra do primeiro e do último nome (ex.: "Cliente Fomegão" -> "CF")
function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

function confirmarRemocao(endereco, aoConfirmar) {
  const mensagem = `Remover o endereço "${endereco.apelido}"?`;

  // Alert.alert com botões não funciona no navegador, então no web usamos o confirm dele
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) {
      aoConfirmar();
    }
    return;
  }

  Alert.alert('Remover endereço', mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Remover', style: 'destructive', onPress: aoConfirmar },
  ]);
}

export default function PerfilScreen({ navigation }) {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);
  const campoCep = useRef(null);
  const campoRua = useRef(null);
  const campoBairro = useRef(null);
  // Conta que entrou no Login. O "?." evita quebrar se o estado se perder (ex.: Fast Refresh)
  // Os endereços ficam na conta, assim o Checkout também consegue usá-los
  const { usuario, enderecos, adicionarEndereco, removerEndereco, fazerLogout } = useAuth();
  const nome = usuario?.nome ?? '';
  const email = usuario?.email ?? '';

  const [adicionando, setAdicionando] = useState(false);
  const [apelido, setApelido] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  // Os erros só aparecem depois da primeira tentativa de salvar (igual ao Login)
  const [tentouSalvar, setTentouSalvar] = useState(false);

  // Achou o CEP: preenche rua e bairro e deixa o cursor no fim da rua pra digitar o número
  const { cep, alterarCep, limparCep, buscando, erro: erroCep, encontrado } = useCep((endereco) => {
    setRua(endereco.rua ? `${endereco.rua}, ` : '');
    setBairro(endereco.bairro);
    campoRua.current?.focus();
  });

  const erroApelido = tentouSalvar && !apelido.trim() ? 'Dê um nome ao endereço (ex.: Casa).' : null;
  const erroRua = tentouSalvar && !rua.trim() ? 'Informe a rua e o número.' : null;
  const erroBairro = tentouSalvar && !bairro.trim() ? 'Informe o bairro.' : null;

  function fecharFormulario() {
    setAdicionando(false);
    setApelido('');
    setRua('');
    setBairro('');
    setTentouSalvar(false);
    limparCep();
  }

  function salvarEndereco() {
    setTentouSalvar(true);

    if (!apelido.trim() || !rua.trim() || !bairro.trim()) {
      return;
    }

    // cidade e UF vêm do CEP e ajudam o Checkout a achar o endereço no mapa pra calcular a entrega
    adicionarEndereco({
      apelido,
      rua,
      bairro,
      cep: encontrado?.cep,
      cidade: encontrado?.cidade,
      uf: encontrado?.uf,
    });
    fecharFormulario();
  }

  let dicaCep = 'Digite o CEP que a gente preenche a rua e o bairro.';
  if (buscando) {
    dicaCep = 'Buscando o CEP...';
  } else if (encontrado) {
    dicaCep = `${encontrado.cidade}/${encontrado.uf}`;
  }

  function sair() {
    fazerLogout();
    // O Login fica no Stack principal, alguns níveis acima desta aba (aba > menu lateral > Stack)
    let alvo = navigation;
    while (alvo.getParent() && !alvo.getState().routeNames.includes('Login')) {
      alvo = alvo.getParent();
    }
    alvo.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.cabecalho}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciais(nome)}</Text>
          </View>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <Text style={styles.secao}>Meus endereços</Text>

        {enderecos.length === 0 && !adicionando && (
          <Text style={styles.vazio}>Você ainda não cadastrou nenhum endereço.</Text>
        )}

        {enderecos.map((endereco) => (
          <View key={endereco.id} style={styles.cartaoEndereco}>
            <Ionicons name="location-outline" size={fontSizes.xl} color={colors.primary} />
            <View style={styles.enderecoTextos}>
              <Text style={styles.enderecoApelido}>{endereco.apelido}</Text>
              <Text style={styles.enderecoLinha}>{endereco.rua}</Text>
              <Text style={styles.enderecoLinha}>
                {endereco.cidade
                  ? `${endereco.bairro} - ${endereco.cidade}/${endereco.uf}`
                  : endereco.bairro}
              </Text>
            </View>
            <Pressable
              onPress={() => confirmarRemocao(endereco, () => removerEndereco(endereco.id))}
              hitSlop={spacing.sm}
              accessibilityRole="button"
              accessibilityLabel={`Remover endereço ${endereco.apelido}`}
            >
              <Ionicons name="trash-outline" size={fontSizes.lg} color={colors.error} />
            </Pressable>
          </View>
        ))}

        {adicionando ? (
          <View style={styles.formulario}>
            <Input
              label="Nome do endereço"
              value={apelido}
              onChangeText={setApelido}
              erro={erroApelido}
              placeholder="Casa, Trabalho..."
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => campoCep.current?.focus()}
              submitBehavior="submit"
            />
            <Input
              ref={campoCep}
              label="CEP"
              value={cep}
              onChangeText={alterarCep}
              erro={erroCep}
              placeholder="00000-000"
              keyboardType="number-pad"
              maxLength={9}
              returnKeyType="next"
              onSubmitEditing={() => campoRua.current?.focus()}
              submitBehavior="submit"
              style={erroCep ? undefined : styles.campoCep}
            />
            {!erroCep && <Text style={styles.dicaCep}>{dicaCep}</Text>}
            <Input
              ref={campoRua}
              label="Rua e número"
              value={rua}
              onChangeText={setRua}
              erro={erroRua}
              placeholder="Rua das Flores, 120"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => campoBairro.current?.focus()}
              submitBehavior="submit"
            />
            <Input
              ref={campoBairro}
              label="Bairro"
              value={bairro}
              onChangeText={setBairro}
              erro={erroBairro}
              placeholder="Centro"
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={salvarEndereco}
            />
            <Button titulo="Salvar endereço" onPress={salvarEndereco} />
            <Button
              titulo="Cancelar"
              variante="secundario"
              onPress={fecharFormulario}
              style={styles.botaoEspaco}
            />
          </View>
        ) : (
          <Button
            titulo="Adicionar endereço"
            variante="secundario"
            onPress={() => setAdicionando(true)}
            style={styles.botaoEspaco}
          />
        )}

        <Button titulo="Sair" onPress={sair} style={styles.sair} />
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
      padding: spacing.lg,
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
    },
    cabecalho: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    avatar: {
      width: tamanhoAvatar,
      height: tamanhoAvatar,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarTexto: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      color: colors.textOnPrimary,
    },
    nome: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.md,
    },
    email: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    secao: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginBottom: spacing.sm,
      alignSelf: 'center',
    },
    vazio: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      alignSelf: 'center',
    },
    cartaoEndereco: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    enderecoTextos: {
      flex: 1,
    },
    enderecoApelido: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    enderecoLinha: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    formulario: {
      marginTop: spacing.sm,
    },
    // a dica fica coladinha embaixo do CEP, no lugar onde aparece o erro
    campoCep: {
      marginBottom: spacing.xs,
    },
    dicaCep: {
      fontSize: fontSizes.xs,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    botaoEspaco: {
      marginTop: spacing.sm,
    },
    sair: {
      marginTop: spacing.xl,
    },
  });
}