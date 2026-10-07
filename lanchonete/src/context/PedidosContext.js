import { createContext, useContext, useState } from 'react';

import { useAuth } from './AuthContext';

const PedidosContext = createContext();

export function PedidosProvider({ children }) {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  function registrarPedido(pedido) {
    if (!usuario) {
      return;
    }

    setPedidos((atuais) => [
      {
        ...pedido,
        id: `${pedido.numero}-${Date.now()}`,
        emailUsuario: usuario.email,
        data: new Date().toISOString(),
      },
      ...atuais,
    ]);
  }

  const meusPedidos = usuario
    ? pedidos.filter((pedido) => pedido.emailUsuario === usuario.email)
    : [];

  return (
    <PedidosContext.Provider value={{ pedidos: meusPedidos, registrarPedido }}>
      {children}
    </PedidosContext.Provider>
  );
}

export const usePedidos = () => useContext(PedidosContext);
