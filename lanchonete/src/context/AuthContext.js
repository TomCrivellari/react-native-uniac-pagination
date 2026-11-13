import { createContext, useContext, useEffect, useState } from 'react';

import {
  cadastrar,
  entrar,
  entrarComGoogle as entrarPeloGoogle,
  mensagemDeErro,
  observarUsuario,
  sair,
  usuarioAtual,
} from '../services/auth';
import { buscarPerfil, salvarEnderecos } from '../services/usuarios';

const AuthContext = createContext();

// Erros do firebase que são do e-mail; o resto o Login mostra embaixo da senha
const errosDeEmail = ['auth/invalid-email', 'auth/user-not-found', 'auth/user-disabled'];

// Fechar a janela do Google não é erro, a pessoa só desistiu
const googleCancelado = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

export function AuthProvider({ children }) {
  // Conta logada ({ uid, nome, email }), ou null
  const [usuario, setUsuario] = useState(null);
  // Endereços da conta logada (cadastrados no Perfil, escolhidos no Checkout)
  const [enderecos, setEnderecos] = useState([]);
  // Fica true até o firebase dizer se já tinha alguém logado (a Splash espera isso)
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    return observarUsuario(async (conta) => {
      if (!conta) {
        setUsuario(null);
        setEnderecos([]);
        setCarregando(false);
        return;
      }

      const perfil = await buscarPerfil(conta.uid).catch(() => null);

      // se a pessoa saiu enquanto o perfil carregava, ignora
      if (usuarioAtual()?.uid !== conta.uid) {
        return;
      }

      setUsuario({
        uid: conta.uid,
        nome: perfil?.nome || conta.displayName || '',
        email: conta.email,
      });
      setEnderecos(perfil?.enderecos ?? []);
      setCarregando(false);
    });
  }, []);

  // Devolve a mensagem de erro, ou null quando a conta foi criada
  async function criarConta({ nome, email, senha }) {
    try {
      await cadastrar({ nome, email, senha });
      // o firebase já entra na conta nova, mas aqui o fluxo é voltar pro Login e entrar com a senha
      await sair();
      return null;
    } catch (erro) {
      return mensagemDeErro(erro);
    }
  }

  // Devolve { campo, mensagem } para o Login mostrar no campo certo, ou null quando entrou
  async function fazerLogin(email, senha) {
    try {
      await entrar(email, senha);
      return null;
    } catch (erro) {
      return {
        campo: errosDeEmail.includes(erro.code) ? 'email' : 'senha',
        mensagem: mensagemDeErro(erro),
      };
    }
  }

  // Devolve null quando entrou, { cancelado: true } se fechou a janela, ou { mensagem }
  async function entrarComGoogle() {
    try {
      await entrarPeloGoogle();
      return null;
    } catch (erro) {
      if (googleCancelado.includes(erro.code)) {
        return { cancelado: true };
      }
      return { mensagem: mensagemDeErro(erro) };
    }
  }

  const fazerLogout = () => sair();

  // Troca a lista na tela na hora e salva no banco em segundo plano
  function alterarEnderecos(alterar) {
    if (!usuario) {
      return;
    }

    const novos = alterar(enderecos);
    setEnderecos(novos);
    salvarEnderecos(usuario.uid, novos).catch((erro) =>
      console.warn('Não deu pra salvar os endereços', erro)
    );
  }

  // cep, cidade e uf vêm da busca de CEP do Perfil (ficam vazios se a pessoa não usou)
  function adicionarEndereco({ apelido, rua, bairro, cep = '', cidade = '', uf = '' }) {
    alterarEnderecos((atuais) => [
      ...atuais,
      {
        id: Date.now(),
        apelido: apelido.trim(),
        rua: rua.trim(),
        bairro: bairro.trim(),
        cep,
        cidade,
        uf,
      },
    ]);
  }

  function removerEndereco(id) {
    alterarEnderecos((atuais) => atuais.filter((endereco) => endereco.id !== id));
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        enderecos,
        criarConta,
        fazerLogin,
        entrarComGoogle,
        fazerLogout,
        adicionarEndereco,
        removerEndereco,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
