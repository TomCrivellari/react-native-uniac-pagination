import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEstilos } from '../context/TemaContext';
import { produtos } from '../data/produtos';
import { fontSizes, fontWeights, spacing } from '../theme';

const tamanhoLogo = 120;
const quantidadeDestaques = 4;

// Os primeiros produtos disponíveis do cardápio
const destaques = produtos.filter((p) => p.disponivel).slice(0, quantidadeDestaques);

export default function HomeScreen({ navigation }) {
  const styles = useEstilos(criarEstilos);
  const { usuario } = useAuth();
  const { adicionarItem } = useCart();

  const primeiroNome = usuario?.nome?.trim().split(' ')[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        accessibilityLabel="O Fomegão"
      />

      <Header
        titulo={primeiroNome ? `Olá, ${primeiroNome}!` : 'Bem-vindo ao Fomegão!'}
        subtitulo="O que vai ser hoje?"
        icone="restaurant"
      />

      <Text style={styles.secao}>Destaques do cardápio</Text>
      <View style={styles.lista}>
        {destaques.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            onAdicionar={adicionarItem}
            onPress={() => navigation.navigate('DetalhesProduto', { produtoId: produto.id })}
          />
        ))}
      </View>

      <Button
        titulo="Ver cardápio completo"
        onPress={() => navigation.navigate('ListaProdutos')}
        style={styles.botao}
      />
    </ScrollView>
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
    logo: {
      width: tamanhoLogo,
      height: tamanhoLogo,
      alignSelf: 'center',
      marginBottom: spacing.md,
    },
    secao: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    lista: {
      gap: spacing.sm,
    },
    botao: {
      marginTop: spacing.lg,
    },
  });
}
