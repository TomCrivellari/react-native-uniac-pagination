import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

import { db } from './firebase';

function comData(documento) {
  const dados = documento.data();

  return {
    ...dados,
    id: documento.id,
    // a tela de pedidos trabalha com data em texto
    data: dados.criadoEm?.toDate().toISOString() ?? new Date().toISOString(),
  };
}

// pedido no formato que o Checkout monta: { numero, itens, tipo, endereco, pagamento, total, ... }
export async function criarPedido(usuarioId, pedido) {
  const novo = await addDoc(collection(db, 'pedidos'), {
    ...pedido,
    usuarioId,
    status: 'recebido',
    criadoEm: serverTimestamp(),
  });

  return novo.id;
}

export async function listarPedidosDoUsuario(usuarioId) {
  const resultado = await getDocs(query(collection(db, 'pedidos'), where('usuarioId', '==', usuarioId)));

  // mais recente primeiro. ordenando aqui pra não precisar de índice no firestore
  return resultado.docs.map(comData).sort((a, b) => b.data.localeCompare(a.data));
}

export async function buscarPedido(id) {
  const documento = await getDoc(doc(db, 'pedidos', id));

  if (!documento.exists()) {
    return null;
  }

  return comData(documento);
}
