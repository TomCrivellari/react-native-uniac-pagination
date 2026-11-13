import { createContext, useContext, useEffect, useState } from 'react';

import { criarPedido, listarPedidosDoUsuario } from '../services/pedidos';
import { useAuth } from './AuthContext';

const PedidosContext = createContext();

export function PedidosProvider({ children }) {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const uid = usuario?.uid;

  // Busca o histórico no banco sempre que troca a conta logada
  useEffect(() => {
    if (!uid) {
      setPedidos([]);
      return;
    }

    let ativo = true;
    listarPedidosDoUsuario(uid)
      .then((lista) => ativo && setPedidos(lista))
      .catch((erro) => console.warn('Não deu pra carregar os pedidos', erro));

    return () => {
      ativo = false;
    };
  }, [uid]);

  function registrarPedido(pedido) {
    if (!uid) {
      return;
    }

    // Já aparece em "Meus pedidos" e vai pro banco em segundo plano
    setPedidos((atuais) => [
      { ...pedido, id: `${pedido.numero}-${Date.now()}`, data: new Date().toISOString() },
      ...atuais,
    ]);
    criarPedido(uid, pedido).catch((erro) => console.warn('Não deu pra salvar o pedido', erro));
  }

  return (
    <PedidosContext.Provider value={{ pedidos, registrarPedido }}>
      {children}
    </PedidosContext.Provider>
  );
}

export const usePedidos = () => useContext(PedidosContext);
