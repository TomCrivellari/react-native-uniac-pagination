import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useState } from "react"
import {
  Image,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
  Modal,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useCart } from "../context/CartContext"
import { useEstilos, useTema } from "../context/TemaContext"
import { categorias, produtos } from "../data/produtos"
import { fontSizes, fontWeights, radius, spacing } from "../theme"
import { formatarPreco } from "../utils/formatarPreco"

const tamanhoFoto = 96

// Cada aba junta categorias de produtos.js, na ordem em que aparecem na lista
const abasCardapio = [
  {
    chave: "lanches",
    titulo: "Lanches",
    icone: "hamburger",
    categoriaIds: [1, 2, 3, 4, 5, 8],
  },
  { chave: "bebidas", titulo: "Bebidas", icone: "cup", categoriaIds: [6] },
  {
    chave: "sobremesas",
    titulo: "Sobremesas",
    icone: "ice-cream",
    categoriaIds: [7],
  },
]

const imagensProdutos = {
  1: require("../data/img/xburguer.jpg"),
  2: require("../data/img/xsalada.jpg"),
  3: require("../data/img/xbacon.jpg"),
  4: require("../data/img/xtudo.jpg"),
  5: require("../data/img/xburguer-combo.jpg"),
  6: require("../data/img/xbacon-combo.jpg"),
  7: require("../data/img/hotdog.jpg"),
  8: require("../data/img/hotdog-completo.jpg"),
  9: require("../data/img/batataFrita.jpg"),
  10: require("../data/img/nuggets.jpg"),
  11: require("../data/img/mistoQuente.jpg"),
  12: require("../data/img/sanduicheFrango.jpg"),
  13: require("../data/img/refrigerantes.jpg"),
  14: require("../data/img/refrigerantes-600ml.jpg"),
  15: require("../data/img/sucos.jpg"),
  16: require("../data/img/agua.jpg"),
  17: require("../data/img/brownie.jpg"),
  18: require("../data/img/milkshake.jpg"),
  19: require("../data/img/molho.jpg"),
  20: require("../data/img/barbecue.jpg"),
}

// Uma seção por categoria da aba, só com os produtos disponíveis
function secoesDaAba(chave) {
  const aba = abasCardapio.find((a) => a.chave === chave)

  return aba.categoriaIds
    .map((id) => ({
      titulo: categorias.find((c) => c.id === id).nome,
      data: produtos.filter((p) => p.categoriaId === id && p.disponivel),
    }))
    .filter((secao) => secao.data.length > 0)
}

export default function MenuScreen({ navigation }) {
  const { colors } = useTema()
  const styles = useEstilos(criarEstilos)
  const insets = useSafeAreaInsets()
  const { quantidadeTotal, total, adicionarItem } = useCart()
  const [abaAtiva, setAbaAtiva] = useState(abasCardapio[0].chave)

  const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  const secoes = secoesDaAba(abaAtiva)
  // Aba com uma categoria só não repete o nome dela acima da lista
  const mostrarTitulos = secoes.length > 1

  function verCarrinho() {
    // O Carrinho é uma aba dentro do menu lateral: App → Abas → Carrinho
    navigation.navigate("App", {
      screen: "Abas",
      params: { screen: "Carrinho" },
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.abas} accessibilityRole="tablist">
        {abasCardapio.map((aba) => {
          const ativa = aba.chave === abaAtiva
          const cor = ativa ? colors.primary : colors.textSecondary

          return (
            <Pressable
              key={aba.chave}
              onPress={() => setAbaAtiva(aba.chave)}
              style={styles.aba}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativa }}
            >
              <View style={styles.abaConteudo}>
                <MaterialCommunityIcons
                  name={aba.icone}
                  size={fontSizes.lg}
                  color={cor}
                />
                <Text
                  style={[
                    styles.abaTexto,
                    { color: cor },
                    ativa && styles.abaTextoAtiva,
                  ]}
                >
                  {aba.titulo}
                </Text>
              </View>
              <View
                style={[styles.abaIndicador, ativa && styles.abaIndicadorAtivo]}
              />
            </Pressable>
          )
        })}
      </View>

      <SectionList
        key={abaAtiva} // lista nova a cada aba: volta para o topo
        sections={secoes}
        keyExtractor={(item) => String(item.id)}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        renderSectionHeader={({ section }) =>
          mostrarTitulos ? (
            <Text
              style={[
                styles.secaoTitulo,
                section !== secoes[0] && styles.secaoTituloEspacado,
              ]}
            >
              {section.titulo}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => setProdutoSelecionado(item)}
          >
            <Image
              source={imagensProdutos[item.id]}
              style={styles.foto}
              resizeMode="cover"
            />

            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.descricao} numberOfLines={2}>
                {item.descricao}
              </Text>

              <View style={styles.linhaPreco}>
                <Text style={styles.preco}>{formatarPreco(item.preco)}</Text>
                <Pressable
                  onPress={() => adicionarItem(item)}
                  hitSlop={spacing.xs}
                  style={({ pressed }) => [
                    styles.botaoAdicionar,
                    pressed && styles.botaoPressionado,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Adicionar ${item.nome} ao carrinho`}
                >
                  <Ionicons
                    name="add"
                    size={fontSizes.lg}
                    color={colors.textOnPrimary}
                  />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />

      <Modal
        visible={produtoSelecionado !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setProdutoSelecionado(null)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            {produtoSelecionado && (
              <>
                <Image
                  source={imagensProdutos[produtoSelecionado.id]}
                  style={styles.modalFoto}
                  resizeMode="cover"
                />

                <Text style={styles.modalNome}>{produtoSelecionado.nome}</Text>

                <Text style={styles.modalDescricao}>
                  {produtoSelecionado.descricao}
                </Text>

                <Text style={styles.modalPreco}>
                  {formatarPreco(produtoSelecionado.preco)}
                </Text>

                <Pressable
                  onPress={() => setProdutoSelecionado(null)}
                  style={styles.botaoFechar}
                >
                  <Text style={styles.botaoFecharTexto}>Fechar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Esta tela fica por cima das abas, então o badge do carrinho não aparece: a barra mostra o que já foi adicionado */}
      {quantidadeTotal > 0 && (
        <View
          style={[styles.rodape, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <Pressable
            onPress={verCarrinho}
            style={({ pressed }) => [
              styles.botaoCarrinho,
              pressed && styles.botaoPressionado,
            ]}
            accessibilityRole="button"
          >
            <View style={styles.botaoCarrinhoInfo}>
              <Ionicons
                name="cart"
                size={fontSizes.lg}
                color={colors.textOnPrimary}
              />
              <Text style={styles.botaoCarrinhoTexto}>
                Ver carrinho ({quantidadeTotal})
              </Text>
            </View>
            <Text style={styles.botaoCarrinhoTexto}>
              {formatarPreco(total)}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    abas: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    aba: {
      flex: 1,
      alignItems: "center",
    },
    // Ícone em cima do texto: as 3 abas cabem até em telas de 320 px
    abaConteudo: {
      alignItems: "center",
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
      alignSelf: "stretch",
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
    card: {
      flexDirection: "row",
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "auto",
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

    modalFundo: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalConteudo: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      padding: spacing.lg,
    },
    modalFoto: {
      width: "100%",
      height: 220,
      borderRadius: radius.md,
      marginBottom: spacing.md,
    },
    modalNome: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    modalDescricao: {
      marginTop: spacing.sm,
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    modalPreco: {
      marginTop: spacing.md,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.primary
    },
    botaoFechar: {
      alignItems: "center",
      marginTop: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.primary,
    },
    botaoFecharTexto: {
      color: colors.textOnPrimary,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
    },
    rodape: {
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    botaoCarrinho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    botaoCarrinhoInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    botaoCarrinhoTexto: {
      color: colors.textOnPrimary,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
    },
  })
}
