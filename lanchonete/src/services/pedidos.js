import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

import { db } from './firebase';

export const statusDoPedido = {
  recebido: 'Recebido',
  emPreparo: 'Em preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

// itens vem do carrinho no formato [{ id, nome, preco, quantidade }]
export async function criarPedido({ usuarioId, itens, formaPagamento, enderecoEntrega }) {
  if (!itens?.length) {
    throw new Error('O carrinho está vazio.');
  }

  // guarda nome e preço do jeito que estavam na hora da compra,
  // assim se o preço mudar depois o histórico não muda junto
  const itensDoPedido = itens.map((item) => ({
    produtoId: item.id,
    nome: item.nome,
    precoUnitario: item.preco,
    quantidade: item.quantidade,
  }));

  const total = arredondar(
    itensDoPedido.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0),
  );

  const novo = await addDoc(collection(db, 'pedidos'), {
    usuarioId,
    itens: itensDoPedido,
    total,
    status: 'recebido',
    formaPagamento,
    enderecoEntrega: enderecoEntrega ?? null,
    criadoEm: serverTimestamp(),
  });

  return novo.id;
}

export async function listarPedidosDoUsuario(usuarioId) {
  const resultado = await getDocs(query(collection(db, 'pedidos'), where('usuarioId', '==', usuarioId)));

  // mais recente primeiro. ordenando aqui pra não precisar de índice no firestore
  return resultado.docs
    .map((documento) => ({ id: documento.id, ...documento.data() }))
    .sort((a, b) => (b.criadoEm?.toMillis() ?? 0) - (a.criadoEm?.toMillis() ?? 0));
}

export async function buscarPedido(id) {
  const documento = await getDoc(doc(db, 'pedidos', id));

  if (!documento.exists()) {
    return null;
  }

  return { id: documento.id, ...documento.data() };
}
