import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { db } from './firebase';

// o id do documento é o mesmo uid do usuário no Authentication
export async function criarPerfil(uid, { nome, email, telefone = '' }) {
  await setDoc(doc(db, 'usuarios', uid), {
    nome,
    email,
    telefone,
    endereco: null,
    criadoEm: serverTimestamp(),
  });
}

export async function buscarPerfil(uid) {
  const documento = await getDoc(doc(db, 'usuarios', uid));

  if (!documento.exists()) {
    return null;
  }

  return { id: documento.id, ...documento.data() };
}

// manda só o que mudou, ex: atualizarPerfil(uid, { telefone: '(11) 98888-7777' })
export async function atualizarPerfil(uid, dados) {
  await updateDoc(doc(db, 'usuarios', uid), dados);
}

export async function salvarEndereco(uid, { rua, numero, bairro, cidade, complemento = '' }) {
  await updateDoc(doc(db, 'usuarios', uid), {
    endereco: { rua, numero, bairro, cidade, complemento },
  });
}
