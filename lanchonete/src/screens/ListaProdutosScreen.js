import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useEstilos, useTema } from '../context/TemaContext';
import { categorias, produtos } from '../data/produtos';
import { fontSizes, fontWeights, radius, spacing } from '../theme';
import { formatarPreco } from '../utils/formatarPreco';

// Cada aba junta categorias de produtos.js, na ordem em que aparecem na lista
const abasCardapio = [
  {
    chave: 'lanches',
    titulo: 'Lanches',
    icone: 'hamburger',
    categoriaIds: [1, 2, 3, 4, 5, 8],
  },
  { chave: 'bebidas', titulo: 'Bebidas', icone: 'cup', categoriaIds: [6] },
  { chave: 'sobremesas', titulo: 'Sobremesas', icone: 'ice-cream', categoriaIds: [7] },
];

// Uma seção por categoria da aba, só com os produtos disponíveis
function secoesDaAba(chave) {
  const aba = abasCardapio.find((a) => a.chave === chave);

  return aba.categoriaIds
    .map((id) => ({
      titulo: categorias.find((c) => c.id === id).nome,
      data: produtos.filter((p) => p.categoriaId === id && p.disponivel),
    }))
    .filter((secao) => secao.data.length > 0);
}

// Lista de produtos (Cardápio e aba Busca): abas por tipo, pesquisa e atalho para o carrinho
export default function ListaProdutosScreen({ navigation }) {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const { quantidadeTotal, total, adicionarItem } = useCart();
  const [abaAtiva, setAbaAtiva] = useState(abasCardapio[0].chave);
  const [busca, setBusca] = useState('');

  const termoBusca = busca.trim().toLocaleLowerCase();
  const secoes = secoesDaAba(abaAtiva)
    .map((secao) => ({
      ...secao,
      data: termoBusca
        ? secao.data.filter(
            (produto) =>
              produto.nome.toLocaleLowerCase().includes(termoBusca) ||
              produto.descricao.toLocaleLowerCase().includes(termoBusca)
          )
        : secao.data,
    }))
    .filter((secao) => secao.data.length > 0);
  // Aba com uma categoria só não repete o nome dela acima da lista
  const mostrarTitulos = secoes.length > 1;

  function verCarrinho() {
    // O Carrinho é uma aba dentro do menu lateral: App → Abas → Carrinho
    navigation.navigate('App', {
      screen: 'Abas',
      params: { screen: 'Carrinho' },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.buscaContainer}>
        <Ionicons name="search-outline" size={fontSizes.lg} color={colors.textSecondary} />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Pesquisar no cardápio"
          placeholderTextColor={colors.textSecondary}
          style={styles.buscaInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Pesquisar produtos no cardápio"
        />
        {busca.length > 0 && (
          <Pressable
            onPress={() => setBusca('')}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel="Limpar pesquisa"
          >
            <Ionicons name="close-circle" size={fontSizes.lg} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <View style={styles.abas} accessibilityRole="tablist">
        {abasCardapio.map((aba) => {
          const ativa = aba.chave === abaAtiva;
          const cor = ativa ? colors.primary : colors.textSecondary;

          return (
            <Pressable
              key={aba.chave}
              onPress={() => setAbaAtiva(aba.chave)}
              style={styles.aba}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativa }}
            >
              <View style={styles.abaConteudo}>
                <MaterialCommunityIcons name={aba.icone} size={fontSizes.lg} color={cor} />
                <Text style={[styles.abaTexto, { color: cor }, ativa && styles.abaTextoAtiva]}>
                  {aba.titulo}
                </Text>
              </View>
              <View style={[styles.abaIndicador, ativa && styles.abaIndicadorAtivo]} />
            </Pressable>
          );
        })}
      </View>

      <SectionList
        key={abaAtiva} // lista nova a cada aba: volta para o topo
        sections={secoes}
        keyExtractor={(item) => String(item.id)}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        renderSectionHeader={({ section }) =>
          mostrarTitulos ? (
            <Text
              style={[styles.secaoTitulo, section !== secoes[0] && styles.secaoTituloEspacado]}
            >
              {section.titulo}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.semResultados}>
            <Ionicons name="search-outline" size={fontSizes.xxl * 2} color={colors.secondary} />
            <Text style={styles.semResultadosTitulo}>Nenhum produto encontrado</Text>
            <Text style={styles.semResultadosTexto}>
              Tente pesquisar por outro nome ou descrição.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            produto={item}
            onAdicionar={adicionarItem}
            onPress={() => navigation.navigate('DetalhesProduto', { produtoId: item.id })}
          />
        )}
      />

      {/* Esta tela fica por cima das abas, então o badge do carrinho não aparece: a barra mostra o que já foi adicionado */}
      {quantidadeTotal > 0 && (
        <View style={[styles.rodape, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable
            onPress={verCarrinho}
            style={({ pressed }) => [styles.botaoCarrinho, pressed && styles.botaoPressionado]}
            accessibilityRole="button"
          >
            <View style={styles.botaoCarrinhoInfo}>
              <Ionicons name="cart" size={fontSizes.lg} color={colors.textOnPrimary} />
              <Text style={styles.botaoCarrinhoTexto}>Ver carrinho ({quantidadeTotal})</Text>
            </View>
            <Text style={styles.botaoCarrinhoTexto}>{formatarPreco(total)}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    buscaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    buscaInput: {
      flex: 1,
      color: colors.text,
      fontSize: fontSizes.md,
      paddingVertical: spacing.xs,
    },
    abas: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    aba: {
      flex: 1,
      alignItems: 'center',
    },
    // Ícone em cima do texto: as 3 abas cabem até em telas de 320 px
    abaConteudo: {
      alignItems: 'center',
      gap: spacing.xs / 2,
      paddingVertical: spacing.sm,
    },
    abaTexto: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
    },
    abaTextoAtiva: {
      fontWeight: fontWeights.bold,
    },
    abaIndicador: {
      alignSelf: 'stretch',
      height: spacing.xs / 2,
      marginHorizontal: spacing.md,
      borderTopLeftRadius: radius.sm,
      borderTopRightRadius: radius.sm,
    },
    abaIndicadorAtivo: {
      backgroundColor: colors.primary,
    },
    lista: {
      padding: spacing.md,
    },
    semResultados: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    semResultadosTitulo: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.md,
      textAlign: 'center',
    },
    semResultadosTexto: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    secaoTitulo: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    secaoTituloEspacado: {
      marginTop: spacing.lg,
    },
    separador: {
      height: spacing.sm,
    },
    botaoPressionado: {
      backgroundColor: colors.primaryDark,
    },
    rodape: {
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    botaoCarrinho: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    botaoCarrinhoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    botaoCarrinhoTexto: {
      color: colors.textOnPrimary,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
    },
  });
}
