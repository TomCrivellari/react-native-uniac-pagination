import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { db } from './firebase';

// o id do documento é o mesmo uid do usuário no Authentication
export async function criarPerfil(uid, { nome, email }) {
  await setDoc(doc(db, 'usuarios', uid), {
    nome,
    email,
    enderecos: [],
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

// manda só o que mudou, ex: atualizarPerfil(uid, { nome: 'Maria' })
export async function atualizarPerfil(uid, dados) {
  await updateDoc(doc(db, 'usuarios', uid), dados);
}

// a lista inteira, do jeito que o Perfil monta: [{ id, apelido, rua, bairro }]
export async function salvarEnderecos(uid, enderecos) {
  await updateDoc(doc(db, 'usuarios', uid), { enderecos });
}
