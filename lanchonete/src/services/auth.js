import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { Platform } from 'react-native';

import { auth } from './firebase';
import { buscarPerfil, criarPerfil } from './usuarios';

// no celular o google precisa de uma development build, no expo go não funciona.
// por enquanto fica só na web
export const googleDisponivel = Platform.OS === 'web';

const mensagens = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/missing-email': 'Digite o e-mail.',
  'auth/missing-password': 'Digite a senha.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/email-already-in-use': 'Já existe uma conta com esse e-mail.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Espere um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  'auth/popup-closed-by-user': 'A janela do Google foi fechada antes de terminar.',
  'auth/cancelled-popup-request': 'A janela do Google foi fechada antes de terminar.',
  'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Libere os pop-ups e tente de novo.',
  'app/google-indisponivel': 'Por enquanto o login com Google só funciona na versão web.',
};

// o firebase devolve uns códigos tipo "auth/invalid-credential", aqui vira texto pra mostrar na tela
export function mensagemDeErro(erro) {
  return mensagens[erro?.code] ?? 'Algo deu errado. Tente novamente.';
}

export async function cadastrar({ nome, email, senha }) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), senha);

  await updateProfile(user, { displayName: nome.trim() });
  await criarPerfil(user.uid, { nome: nome.trim(), email: user.email });

  return user;
}

export async function entrar(email, senha) {
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), senha);
  return user;
}

export async function entrarComGoogle() {
  if (!googleDisponivel) {
    const erro = new Error('login com google indisponível nessa plataforma');
    erro.code = 'app/google-indisponivel';
    throw erro;
  }

  const provedor = new GoogleAuthProvider();
  provedor.setCustomParameters({ prompt: 'select_account' });

  const { user } = await signInWithPopup(auth, provedor);

  // na primeira vez que a pessoa entra pelo google ainda não existe perfil no banco
  const perfil = await buscarPerfil(user.uid);
  if (!perfil) {
    await criarPerfil(user.uid, { nome: user.displayName ?? '', email: user.email });
  }

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
