import { View, Text, FlatList, StyleSheet } from "react-native"
import { produtos } from "../data/produtos.js"

export default function MenuScreen() {
  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.descricao}>{item.descricao}</Text>
          <Text style={styles.preco}>
            {item.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
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
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  descricao: {
    marginTop: 8,
    color: '#666'
  },
  preco: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E63946'
  }

})
