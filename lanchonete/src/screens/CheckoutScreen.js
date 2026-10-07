import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
// Depende do CartContext (Guilherme). Precisa expor: itens, total e limparCarrinho.
// Cada item precisa ter: nome e quantidade.
import { useCart } from '../context/CartContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { fontSizes, fontWeights, radius, spacing } from '../theme';
import { formatarPreco } from '../utils/formatarPreco';

const TAXA_ENTREGA = 5;

const tiposEntrega = [
  { id: 'entrega', rotulo: 'Entrega', icone: 'bicycle-outline', tempo: '40 a 50 min' },
  { id: 'retirada', rotulo: 'Retirada', icone: 'storefront-outline', tempo: '20 a 30 min' },
];

const formasPagamento = [
  { id: 'pix', rotulo: 'Pix', icone: 'qr-code-outline' },
  { id: 'cartao', rotulo: 'Cartão na entrega', icone: 'card-outline' },
  { id: 'dinheiro', rotulo: 'Dinheiro', icone: 'cash-outline' },
];

// Opção da lista de endereços que mostra o campo para digitar
const OUTRO_ENDERECO = 'outro';

export default function CheckoutScreen({ navigation }) {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);
  const { itens, total } = useCart();
  // Endereços cadastrados no Perfil da conta logada
  const { enderecos } = useAuth();

  const [tipo, setTipo] = useState('entrega');
  const [enderecoEscolhido, setEnderecoEscolhido] = useState(enderecos[0]?.id ?? OUTRO_ENDERECO);
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState(null);
  const [erros, setErros] = useState({});

  const entrega = tipo === 'entrega';
  const taxa = entrega ? TAXA_ENTREGA : 0;
  const totalFinal = total + taxa;
  // Sem endereço salvo escolhido, vale o que foi digitado
  const enderecoSalvo = enderecos.find((e) => e.id === enderecoEscolhido);

  function confirmarPedido() {
    const novosErros = {};
    if (entrega && !enderecoSalvo && endereco.trim().length < 5) {
      novosErros.endereco = 'Informe o endereço de entrega.';
    }
    if (!pagamento) {
      novosErros.pagamento = 'Escolha a forma de pagamento.';
    }
    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      Alert.alert('Falta pouco!', 'Revise os campos destacados antes de confirmar.');
      return;
    }

    const pedido = {
      numero: Math.floor(1000 + Math.random() * 9000),
      tempoEstimado: tiposEntrega.find((t) => t.id === tipo).tempo,
      tipo: entrega ? 'Entrega' : 'Retirada',
      endereco: entrega
        ? enderecoSalvo
          ? `${enderecoSalvo.rua}, ${enderecoSalvo.bairro}`
          : endereco.trim()
        : null,
      pagamento: formasPagamento.find((f) => f.id === pagamento).rotulo,
      total: totalFinal,
    };

    // reset: tira o Checkout do histórico, assim o "voltar" não reabre um carrinho já limpo
    navigation.reset({
      index: 1,
      routes: [{ name: 'App' }, { name: 'Confirmacao', params: { pedido } }],
    });
  }

  if (itens.length === 0) {
    return (
      <View style={styles.vazio}>
        <Ionicons name="cart-outline" size={fontSizes.xxl * 2} color={colors.secondary} />
        <Text style={styles.vazioTitulo}>Seu carrinho está vazio</Text>
        <Text style={styles.vazioTexto}>Adicione produtos para finalizar um pedido.</Text>
        <Button titulo="Voltar" onPress={() => navigation.goBack()} style={styles.botaoVoltar} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.secao}>Resumo do pedido</Text>
        <View style={styles.card}>
          {itens.map((item, indice) => (
            <Text key={item.id ?? indice} style={styles.itemResumo}>
              {item.quantidade}x {item.nome}
            </Text>
          ))}
        </View>

        <Text style={styles.secao}>Como você quer receber?</Text>
        <View style={styles.linha}>
          {tiposEntrega.map((opcao) => {
            const ativo = tipo === opcao.id;
            return (
              <Pressable
                key={opcao.id}
                onPress={() => setTipo(opcao.id)}
                style={[styles.opcaoTipo, ativo && styles.opcaoAtiva]}
              >
                <Ionicons
                  name={opcao.icone}
                  size={fontSizes.xl}
                  color={ativo ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.opcaoTexto, ativo && styles.opcaoTextoAtivo]}>
                  {opcao.rotulo}
                </Text>
                <Text style={styles.opcaoTempo}>{opcao.tempo}</Text>
              </Pressable>
            );
          })}
        </View>

        {entrega && (
          <>
            <Text style={styles.secao}>Endereço de entrega</Text>

            {enderecos.length > 0 && (
              <View style={styles.card}>
                {enderecos.map((salvo) => {
                  const ativo = enderecoEscolhido === salvo.id;
                  return (
                    <Pressable
                      key={salvo.id}
                      onPress={() => setEnderecoEscolhido(salvo.id)}
                      style={styles.opcaoPagamento}
                      accessibilityRole="radio"
                      aria-checked={ativo}
                    >
                      <Ionicons
                        name="location-outline"
                        size={fontSizes.lg}
                        color={ativo ? colors.primary : colors.textSecondary}
                      />
                      <View style={styles.enderecoTextos}>
                        <Text style={styles.enderecoApelido}>{salvo.apelido}</Text>
                        <Text style={styles.enderecoLinha}>
                          {salvo.rua}, {salvo.bairro}
                        </Text>
                      </View>
                      <Ionicons
                        name={ativo ? 'radio-button-on' : 'radio-button-off'}
                        size={fontSizes.lg}
                        color={ativo ? colors.primary : colors.border}
                      />
                    </Pressable>
                  );
                })}

                <Pressable
                  onPress={() => setEnderecoEscolhido(OUTRO_ENDERECO)}
                  style={styles.opcaoPagamento}
                  accessibilityRole="radio"
                  aria-checked={!enderecoSalvo}
                >
                  <Ionicons
                    name="create-outline"
                    size={fontSizes.lg}
                    color={!enderecoSalvo ? colors.primary : colors.textSecondary}
                  />
                  <Text style={styles.pagamentoTexto}>Outro endereço</Text>
                  <Ionicons
                    name={!enderecoSalvo ? 'radio-button-on' : 'radio-button-off'}
                    size={fontSizes.lg}
                    color={!enderecoSalvo ? colors.primary : colors.border}
                  />
                </Pressable>
              </View>
            )}

            {/* Sem endereços: aviso no lugar da lista; o campo abaixo continua aceitando o digitado */}
            {enderecos.length === 0 && (
              <View style={[styles.card, styles.semEnderecos]}>
                <Text style={styles.semEnderecosTitulo}>
                  Nenhum endereço cadastrado para esta conta.
                </Text>
                <Text style={styles.dica}>Cadastre endereços no Perfil para escolher aqui.</Text>
              </View>
            )}

            {!enderecoSalvo && (
              <Input
                value={endereco}
                onChangeText={setEndereco}
                placeholder="Endereço de entrega (rua, número, bairro)"
                erro={erros.endereco}
                style={styles.campo}
              />
            )}
          </>
        )}

        <Text style={styles.secao}>Forma de pagamento</Text>
        <View style={styles.card}>
          {formasPagamento.map((forma) => {
            const ativo = pagamento === forma.id;
            return (
              <Pressable
                key={forma.id}
                onPress={() => setPagamento(forma.id)}
                style={styles.opcaoPagamento}
              >
                <Ionicons
                  name={forma.icone}
                  size={fontSizes.lg}
                  color={ativo ? colors.primary : colors.textSecondary}
                />
                <Text style={styles.pagamentoTexto}>{forma.rotulo}</Text>
                <Ionicons
                  name={ativo ? 'radio-button-on' : 'radio-button-off'}
                  size={fontSizes.lg}
                  color={ativo ? colors.primary : colors.border}
                />
              </Pressable>
            );
          })}
        </View>
        {erros.pagamento && <Text style={styles.erro}>{erros.pagamento}</Text>}

        <View style={styles.card}>
          <View style={styles.linhaValor}>
            <Text style={styles.valorRotulo}>Subtotal</Text>
            <Text style={styles.valorRotulo}>{formatarPreco(total)}</Text>
          </View>
          <View style={styles.linhaValor}>
            <Text style={styles.valorRotulo}>Taxa de entrega</Text>
            <Text style={styles.valorRotulo}>{entrega ? formatarPreco(taxa) : 'Grátis'}</Text>
          </View>
          <View style={[styles.linhaValor, styles.linhaTotal]}>
            <Text style={styles.totalTexto}>Total</Text>
            <Text style={styles.totalTexto}>{formatarPreco(totalFinal)}</Text>
          </View>
        </View>

        <Button titulo="Confirmar pedido" onPress={confirmarPedido} style={styles.botaoConfirmar} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function criarEstilos(colors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    conteudo: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    secao: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    itemResumo: {
      fontSize: fontSizes.md,
      color: colors.text,
      paddingVertical: spacing.xs,
    },
    linha: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    opcaoTipo: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: colors.border,
      padding: spacing.md,
    },
    opcaoAtiva: {
      borderColor: colors.primary,
    },
    opcaoTexto: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    opcaoTextoAtivo: {
      color: colors.primary,
      fontWeight: fontWeights.bold,
    },
    opcaoTempo: {
      fontSize: fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    // O Input já tem marginBottom; aqui o espaço fica só em cima, como nas outras seções
    campo: {
      marginTop: spacing.md,
      marginBottom: 0,
    },
    erro: {
      fontSize: fontSizes.sm,
      color: colors.error,
      marginTop: spacing.xs,
    },
    opcaoPagamento: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm + spacing.xs,
    },
    pagamentoTexto: {
      flex: 1,
      fontSize: fontSizes.md,
      color: colors.text,
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
    semEnderecos: {
      alignItems: 'center',
      alignSelf: 'center',
    },
    semEnderecosTitulo: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: colors.text,
      textAlign: 'center',
    },
    dica: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    linhaValor: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs,
    },
    valorRotulo: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
    },
    linhaTotal: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
    },
    totalTexto: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    botaoConfirmar: {
      marginTop: spacing.lg,
    },
    botaoVoltar: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
    },
    vazio: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    vazioTitulo: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.md,
    },
    vazioTexto: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
}