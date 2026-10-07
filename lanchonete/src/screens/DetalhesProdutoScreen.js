import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { imagensProdutos } from '../data/imagens';
import { categorias, produtos } from '../data/produtos';
import { fontSizes, fontWeights, radius, spacing } from '../theme';
import { formatarPreco } from '../utils/formatarPreco';

// Recebe `produtoId` por parâmetro de rota: foto grande, descrição e quantidade antes de adicionar
export default function DetalhesProdutoScreen({ navigation, route }) {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const { adicionarItem } = useCart();
  const [quantidade, setQuantidade] = useState(1);

  const produto = produtos.find((p) => p.id === route.params?.produtoId);

  if (!produto) {
    return (
      <View style={styles.vazio}>
        <Ionicons name="alert-circle-outline" size={fontSizes.xxl * 2} color={colors.secondary} />
        <Text style={styles.vazioTitulo}>Produto não encontrado</Text>
        <Button titulo="Voltar" onPress={() => navigation.goBack()} style={styles.botaoVoltar} />
      </View>
    );
  }

  const categoria = categorias.find((c) => c.id === produto.categoriaId)?.nome;

  function adicionar() {
    adicionarItem(produto, quantidade);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Image source={imagensProdutos[produto.id]} style={styles.foto} resizeMode="cover" />

        {categoria && <Text style={styles.categoria}>{categoria}</Text>}
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.descricao}>{produto.descricao}</Text>
        <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.quantidade}>
          <Ionicons
            name="remove-circle"
            size={fontSizes.xxl}
            color={quantidade > 1 ? colors.primary : colors.border}
            onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
            accessibilityRole="button"
            accessibilityLabel="Diminuir quantidade"
          />
          <Text style={styles.quantidadeTexto}>{quantidade}</Text>
          <Ionicons
            name="add-circle"
            size={fontSizes.xxl}
            color={colors.primary}
            onPress={() => setQuantidade((q) => q + 1)}
            accessibilityRole="button"
            accessibilityLabel="Aumentar quantidade"
          />
        </View>
        <Button
          titulo={`Adicionar · ${formatarPreco(produto.preco * quantidade)}`}
          onPress={adicionar}
          style={styles.botaoAdicionar}
        />
      </View>
    </View>
  );
}

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    conteudo: {
      padding: spacing.md,
    },
    foto: {
      width: '100%',
      height: 240,
      borderRadius: radius.md,
    },
    categoria: {
      marginTop: spacing.md,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.textSecondary,
    },
    nome: {
      marginTop: spacing.xs,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    descricao: {
      marginTop: spacing.sm,
      fontSize: fontSizes.md,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    preco: {
      marginTop: spacing.md,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.primary,
    },
    rodape: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    quantidade: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    quantidadeTexto: {
      minWidth: spacing.lg,
      textAlign: 'center',
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    botaoAdicionar: {
      flex: 1,
    },
    vazio: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    vazioTitulo: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.md,
    },
    botaoVoltar: {
      marginTop: spacing.lg,
      alignSelf: 'stretch',
    },
  });
}
