import { View, Text, FlatList } from "react-native"
import { produtos } from "../data/produtos.js"

export default function MenuScreen() {
  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View>
          <Text>{item.nome}</Text>
          <Text>{item.descricao}</Text>
          <Text>
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
