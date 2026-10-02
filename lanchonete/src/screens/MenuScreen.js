import { View, Text, FlatList, StyleSheet, Image } from "react-native"
import { produtos } from "../data/produtos.js"

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

export default function MenuScreen() {
  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <>
          <View style={styles.card}>
            <Image
              source={imagensProdutos[item.id]}
              style={{ width: 120, height: 100, borderRadius: '10px' }}
            />
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.preco}>
              {item.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
    display: "flex",
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descricao: {
    marginTop: 8,
    color: "#666",
  },
  preco: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#E63946",
  },
})
