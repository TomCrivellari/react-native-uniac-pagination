import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useEstilos, useTema } from '../context/TemaContext';
import { imagensProdutos } from '../data/imagens';
import { fontSizes, fontWeights, radius, spacing } from '../theme';
import { formatarPreco } from '../utils/formatarPreco';

const tamanhoFoto = 96;

/**
 * Card de um produto: foto, nome, descrição, preço e botão de adicionar ao carrinho.
 *
 * - produto: item de `produtos` (data/produtos.js)
 * - onAdicionar: chamado ao tocar no "+" (recebe o produto)
 * - onPress: chamado ao tocar no card (ex.: abrir os detalhes). Opcional.
 */
export default function ProductCard({ produto, onAdicionar, onPress }) {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `Ver detalhes de ${produto.nome}` : undefined}
      style={styles.card}
    >
      <Image source={imagensProdutos[produto.id]} style={styles.foto} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.descricao} numberOfLines={2}>
          {produto.descricao}
        </Text>

        <View style={styles.linhaPreco}>
          <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
          <Pressable
            onPress={() => onAdicionar?.(produto)}
            hitSlop={spacing.xs}
            style={({ pressed }) => [styles.botaoAdicionar, pressed && styles.botaoPressionado]}
            accessibilityRole="button"
            accessibilityLabel={`Adicionar ${produto.nome} ao carrinho`}
          >
            <Ionicons name="add" size={fontSizes.lg} color={colors.textOnPrimary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function criarEstilos(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
    },
    foto: {
      width: tamanhoFoto,
      height: tamanhoFoto,
      borderRadius: radius.sm,
    },
    info: {
      flex: 1,
    },
    nome: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    descricao: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    linhaPreco: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      paddingTop: spacing.sm,
    },
    preco: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.primary,
    },
    botaoAdicionar: {
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      padding: spacing.xs,
    },
    botaoPressionado: {
      backgroundColor: colors.primaryDark,
    },
  });
}
