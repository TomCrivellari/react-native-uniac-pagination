import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Header from '../components/Header';
import { usePedidos } from '../context/PedidosContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { fontSizes, fontWeights, radius, spacing } from '../theme';
import { formatarPreco } from '../utils/formatarPreco';

export default function PedidosScreen() {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);
  const { pedidos } = usePedidos();

  if (pedidos.length === 0) {
    return (
      <View style={styles.vazio}>
        <Ionicons name="receipt-outline" size={fontSizes.xxl * 2} color={colors.secondary} />
        <Text style={styles.vazioTitulo}>Nenhum pedido ainda</Text>
        <Text style={styles.vazioTexto}>
          Quando você fizer um pedido, ele aparecerá aqui para consulta.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <Header
        titulo="Meus pedidos"
        subtitulo="Confira o resumo dos seus pedidos anteriores."
        icone="receipt"
        style={styles.introducao}
      />

      {pedidos.map((pedido) => (
        <View key={pedido.id} style={styles.card}>
          <View style={styles.cabecalhoCard}>
            <View>
              <Text style={styles.numero}>Pedido #{pedido.numero}</Text>
              <Text style={styles.data}>{formatarData(pedido.data)}</Text>
            </View>
            <View style={styles.status}>
              <Ionicons name="checkmark-circle" size={fontSizes.md} color={colors.success} />
              <Text style={styles.statusTexto}>Concluído</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.itens}>
            {pedido.itens.map((item) => (
              <View key={item.id} style={styles.linhaItem}>
                <Text style={styles.quantidade}>{item.quantidade}x</Text>
                <Text style={styles.nomeItem}>{item.nome}</Text>
                <Text style={styles.precoItem}>{formatarPreco(item.preco * item.quantidade)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divisor} />

          <Linha rotulo="Recebimento" valor={pedido.tipo} />
          <Linha rotulo="Pagamento" valor={pedido.pagamento} />
          {pedido.endereco && <Linha rotulo="Endereço" valor={pedido.endereco} />}

          <View style={[styles.linha, styles.total]}>
            <Text style={styles.totalRotulo}>Total</Text>
            <Text style={styles.totalValor}>{formatarPreco(pedido.total)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Linha({ rotulo, valor }) {
  const styles = useEstilos(criarEstilos);

  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

function formatarData(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(data));
}

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    conteudo: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    introducao: {
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
    cabecalhoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    numero: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    data: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    statusTexto: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.success,
    },
    divisor: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
    },
    itens: {
      gap: spacing.xs,
    },
    linhaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    quantidade: {
      width: spacing.xl,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.primary,
    },
    nomeItem: {
      flex: 1,
      fontSize: fontSizes.md,
      color: colors.text,
    },
    precoItem: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
    },
    linha: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.xs,
    },
    rotulo: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
    },
    valor: {
      flex: 1,
      fontSize: fontSizes.sm,
      color: colors.text,
      textAlign: 'right',
    },
    total: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
    },
    totalRotulo: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    totalValor: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.primary,
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
