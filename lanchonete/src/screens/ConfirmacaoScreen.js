import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
// Depende do CartContext (Guilherme): precisa expor limparCarrinho.
import { useCart } from '../context/CartContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { fontSizes, fontWeights, radius, spacing } from '../theme';
import { formatarPreco } from '../utils/formatarPreco';

export default function ConfirmacaoScreen({ navigation, route }) {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);
  const { pedido } = route.params;
  const { limparCarrinho } = useCart();
  const carrinhoLimpo = useRef(false);

  // O pedido já foi feito: esvazia o carrinho uma única vez ao abrir a tela
  useEffect(() => {
    if (!carrinhoLimpo.current) {
      carrinhoLimpo.current = true;
      limparCarrinho();
    }
  }, [limparCarrinho]);

  function voltarAoInicio() {
    navigation.reset({ index: 0, routes: [{ name: 'App' }] });
  }

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={fontSizes.xxl * 3} color={colors.success} />
      <Text style={styles.titulo}>Pedido confirmado!</Text>
      <Text style={styles.numero}>Pedido #{pedido.numero}</Text>

      <View style={styles.card}>
        <Linha rotulo="Tempo estimado" valor={pedido.tempoEstimado} />
        <Linha rotulo="Recebimento" valor={pedido.tipo} />
        {pedido.endereco && <Linha rotulo="Endereço" valor={pedido.endereco} />}
        <Linha rotulo="Pagamento" valor={pedido.pagamento} />
        <Linha rotulo="Total" valor={formatarPreco(pedido.total)} destaque />
      </View>

      <Button titulo="Voltar ao início" onPress={voltarAoInicio} style={styles.botao} />
    </View>
  );
}

function Linha({ rotulo, valor, destaque }) {
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={[styles.valor, destaque && styles.valorDestaque]}>{valor}</Text>
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
      padding: spacing.lg,
    },
    titulo: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.md,
    },
    numero: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.primary,
      marginTop: spacing.xs,
    },
    card: {
      alignSelf: 'stretch',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginTop: spacing.lg,
    },
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.xs,
    },
    rotulo: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
    },
    valor: {
      flex: 1,
      textAlign: 'right',
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: colors.text,
    },
    valorDestaque: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
    },
    botao: {
      alignSelf: 'stretch',
      marginTop: spacing.lg,
    },
  });
}