import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';

import { db } from './firebase';

function comId(documento) {
  return { id: documento.id, ...documento.data() };
}

function porNome(a, b) {
  return a.nome.localeCompare(b.nome);
}

// tira acento e deixa minúsculo, pra "pao" achar "Pão"
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export async function listarCategorias() {
  const resultado = await getDocs(query(collection(db, 'categorias'), orderBy('ordem')));
  return resultado.docs.map(comId);
}

export async function listarProdutos() {
  const resultado = await getDocs(query(collection(db, 'produtos'), where('disponivel', '==', true)));
  return resultado.docs.map(comId).sort(porNome);
}

export async function listarProdutosDaCategoria(categoriaId) {
  const resultado = await getDocs(
    query(collection(db, 'produtos'), where('categoriaId', '==', categoriaId)),
  );

  // o filtro de disponível é feito aqui pra não precisar criar índice composto no firestore
  return resultado.docs
    .map(comId)
    .filter((produto) => produto.disponivel)
    .sort(porNome);
}

export async function listarDestaques() {
  const resultado = await getDocs(query(collection(db, 'produtos'), where('destaque', '==', true)));

  return resultado.docs
    .map(comId)
    .filter((produto) => produto.disponivel)
    .sort(porNome);
}

export async function buscarProduto(id) {
  const documento = await getDoc(doc(db, 'produtos', id));

  if (!documento.exists()) {
    return null;
  }

  return comId(documento);
}

// o firestore não faz busca por texto, então a gente traz o cardápio e filtra aqui mesmo
export async function pesquisarProdutos(texto) {
  const termo = normalizar(texto);
  const produtos = await listarProdutos();

  if (!termo) {
    return produtos;
  }

  return produtos.filter(
    (produto) =>
      normalizar(produto.nome).includes(termo) || normalizar(produto.descricao).includes(termo),
  );
}
