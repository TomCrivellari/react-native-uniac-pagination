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
  TextInput,
  View,
} from 'react-native';

// Depende do CartContext (Guilherme). Precisa expor: itens, total e limparCarrinho.
// Cada item precisa ter: nome e quantidade.
import { useCart } from '../context/CartContext';
import { colors, fontSizes, fontWeights, radius, spacing } from '../theme';
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

export default function CheckoutScreen({ navigation }) {
  const { itens, total } = useCart();

  const [tipo, setTipo] = useState('entrega');
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState(null);
  const [erros, setErros] = useState({});

  const entrega = tipo === 'entrega';
  const taxa = entrega ? TAXA_ENTREGA : 0;
  const totalFinal = total + taxa;

  function confirmarPedido() {
    const novosErros = {};
    if (entrega && endereco.trim().length < 5) {
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
      endereco: entrega ? endereco.trim() : null,
      pagamento: formasPagamento.find((f) => f.id === pagamento).rotulo,
      total: totalFinal,
    };

    // reset: tira o Checkout do histórico, assim o "voltar" não reabre um carrinho já limpo
    navigation.reset({
      index: 1,
      routes: [{ name: 'Main' }, { name: 'Confirmacao', params: { pedido } }],
    });
  }

  if (itens.length === 0) {
    return (
      <View style={styles.vazio}>
        <Ionicons name="cart-outline" size={fontSizes.xxl * 2} color={colors.secondary} />
        <Text style={styles.vazioTitulo}>Seu carrinho está vazio</Text>
        <Text style={styles.vazioTexto}>Adicione produtos para finalizar um pedido.</Text>
        <Pressable style={styles.botao} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoTexto}>Voltar</Text>
        </Pressable>
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
          <View style={styles.campo}>
            <TextInput
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Endereço de entrega (rua, número, bairro)"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, erros.endereco && styles.inputErro]}
            />
            {erros.endereco && <Text style={styles.erro}>{erros.endereco}</Text>}
          </View>
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

        <Pressable
          onPress={confirmarPedido}
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        >
          <Text style={styles.botaoTexto}>Confirmar pedido</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  campo: {
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  inputErro: {
    borderColor: colors.error,
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
  botao: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  botaoPressionado: {
    backgroundColor: colors.primaryDark,
  },
  botaoTexto: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
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