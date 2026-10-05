import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

// Itens de exemplo: enquanto as telas de produto não existem, é a única forma de testar o carrinho
const itensIniciais = [
  { id: 1, nome: 'X-Burger', preco: 18.9, quantidade: 2 },
  { id: 9, nome: 'Batata Frita', preco: 16.9, quantidade: 1 },
];

export function CartProvider({ children }) {
  const [itens, setItens] = useState(itensIniciais);

  const total = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  const quantidadeTotal = itens.reduce((soma, i) => soma + i.quantidade, 0);

  // Se o produto já está no carrinho, só soma a quantidade
  function adicionarItem(produto, quantidade = 1) {
    setItens((atuais) => {
      const existente = atuais.find((i) => i.id === produto.id);
      if (existente) {
        return atuais.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i
        );
      }
      const { id, nome, preco } = produto;
      return [...atuais, { id, nome, preco, quantidade }];
    });
  }

  // delta: +1 ou -1. Quantidade zerada tira o item do carrinho
  function alterarQuantidade(id, delta) {
    setItens((atuais) =>
      atuais
        .map((i) => (i.id === id ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );
  }

  function removerItem(id) {
    setItens((atuais) => atuais.filter((i) => i.id !== id));
  }

  const limparCarrinho = () => setItens([]);

  return (
    <CartContext.Provider
      value={{
        itens,
        total,
        quantidadeTotal,
        adicionarItem,
        alterarQuantidade,
        removerItem,
        limparCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
