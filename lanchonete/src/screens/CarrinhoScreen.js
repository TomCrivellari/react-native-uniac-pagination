import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { colors, fontSizes, fontWeights, radius, spacing } from '../theme';
import { formatarPreco } from '../utils/formatarPreco';

export default function CarrinhoScreen({ navigation }) {
  const { itens, total, alterarQuantidade, removerItem } = useCart();

  if (itens.length === 0) {
    return (
      <View style={styles.vazio}>
        <Ionicons name="cart-outline" size={fontSizes.xxl * 2} color={colors.secondary} />
        <Text style={styles.vazioTitulo}>Seu carrinho está vazio</Text>
        <Text style={styles.vazioTexto}>Que tal escolher algo gostoso no cardápio?</Text>
        <Button
          titulo="Ver cardápio"
          onPress={() => navigation.navigate('ListaProdutos')}
          style={styles.botaoVazio}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.precoUnitario}>{formatarPreco(item.preco)} cada</Text>
              <Text style={styles.subtotal}>{formatarPreco(item.preco * item.quantidade)}</Text>
            </View>

            <View style={styles.acoes}>
              <Pressable
                onPress={() => removerItem(item.id)}
                hitSlop={spacing.sm}
                accessibilityLabel={`Remover ${item.nome}`}
              >
                <Ionicons name="trash-outline" size={fontSizes.lg} color={colors.error} />
              </Pressable>

              <View style={styles.quantidade}>
                <Pressable
                  onPress={() => alterarQuantidade(item.id, -1)}
                  style={styles.botaoQuantidade}
                  accessibilityLabel="Diminuir quantidade"
                >
                  <Ionicons name="remove" size={fontSizes.md} color={colors.primary} />
                </Pressable>
                <Text style={styles.quantidadeTexto}>{item.quantidade}</Text>
                <Pressable
                  onPress={() => alterarQuantidade(item.id, 1)}
                  style={styles.botaoQuantidade}
                  accessibilityLabel="Aumentar quantidade"
                >
                  <Ionicons name="add" size={fontSizes.md} color={colors.primary} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.rodape}>
        <View style={styles.linhaTotal}>
          <Text style={styles.totalTexto}>Total</Text>
          <Text style={styles.totalTexto}>{formatarPreco(total)}</Text>
        </View>
        <Button
          titulo="Finalizar pedido"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.botaoFinalizar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  precoUnitario: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  subtotal: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  acoes: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  botaoQuantidade: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.full,
    padding: spacing.xs,
  },
  quantidadeTexto: {
    minWidth: spacing.lg,
    textAlign: 'center',
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  rodape: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  linhaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalTexto: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  botaoFinalizar: {
    marginTop: spacing.md,
  },
  botaoVazio: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
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
