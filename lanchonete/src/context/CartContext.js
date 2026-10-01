import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [itens, setItens] = useState([{ id: 1, nome: 'X-Burger', preco: 18, quantidade: 2 }]);
  const total = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  const limparCarrinho = () => setItens([]);

  return (
    <CartContext.Provider value={{ itens, total, limparCarrinho }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);