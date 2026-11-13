import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from './firebase';
import { criarPerfil } from './usuarios';

const mensagens = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/missing-password': 'Digite a senha.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/email-already-in-use': 'Já existe uma conta com esse e-mail.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Espere um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
};

// o firebase devolve uns códigos tipo "auth/invalid-credential", aqui vira texto pra mostrar na tela
export function mensagemDeErro(erro) {
  return mensagens[erro?.code] ?? 'Algo deu errado. Tente novamente.';
}

export async function cadastrar({ nome, email, senha, telefone }) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), senha);

  await updateProfile(user, { displayName: nome });
  await criarPerfil(user.uid, { nome, email: user.email, telefone });

  return user;
}

export async function entrar(email, senha) {
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), senha);
  return user;
}

export function sair() {
  return signOut(auth);
}

export function recuperarSenha(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

export function usuarioAtual() {
  return auth.currentUser;
}

// chama o callback sempre que alguém entra ou sai (recebe null quando não tem ninguém logado).
// retorna uma função pra parar de ouvir, dá pra devolver ela direto no useEffect
export function observarUsuario(callback) {
  return onAuthStateChanged(auth, callback);
}
